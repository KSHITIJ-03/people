const User = require("./../models/userModel")
const Post = require("./../models/postModel")
const Comment = require("./../models/commentModel")
const Like = require("./../models/likeModel")
const AppError = require("../utils/appError")
const catchAsync = require("./../utils/catchAsync")
const multer = require("multer")
const sharp = require("sharp")

//const upload = multer({dest : "/public/img/users"})

// const multerStorage = multer.diskStorage({
//     destination : (req, file, cb) => {
//         cb(null, "public/img/users")
//     }, filename : (req, file, cb) => {
//         const ext = file.mimetype.split("/")[1];
//         cb(null, `user-${req.user._id}-${Date.now()}.${ext}`)
//     }
// }) 

const multerStorage = multer.memoryStorage()

//multer filter that will pass error in cb if uploaded file is not a photo

const multerFilter = (req, file, cb) => {
     if(file.mimetype.startsWith("image")) {
        cb(null, true)
     } else {
        cb(new AppError("not an image please upload an image", 400), false)
     }
}

const upload = multer({
    storage : multerStorage,
    fileFilter : multerFilter
})

exports.resizePhoto = (req, res, next) => {

    if(!req.file) return next()

    req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`

    sharp(req.file.buffer).resize(500, 500).toFormat("jpeg").toFile(`public/img/users/${req.file.filename}`)

    next()
}

exports.uploadUserDp = upload.single("displayPhoto")

exports.searchUsers = catchAsync( async (req, res, next) => {

    const search = req.body.search

    const user = await User.findOne({name : search}).select("-email").populate("posts")

    if(!user) {
        return next(new AppError("user not found", 404))
    }
    res.status(200).json({
        status : "success",
        user
    })

})

exports.getAllUsers = catchAsync(async (req, res, next) => {

    const users = await User.find()
    res.status(200).json({
        status : "success",
        count : users.length,
        users
    })
})

exports.getUser = catchAsync(async (req, res, next) => {

    const user = await User.findById(req.user._id).populate("posts")

    res.status(200).json({
        status : "success",
        user
    })
})

exports.updateMe = catchAsync(async (req, res, next) => {

    console.log(req.file);
    console.log(req.body);

    //console.log(req.user);
    if(req.body.password){
        return next(new AppError("password do not update here", 400))
    }

    let displayPhoto
    if(req.file) {
        displayPhoto = req.file.filename
    }

    const user = await User.findOneAndUpdate({email : req.user.email}, {
        name : req.body.name, username : req.body.username, displayPhoto}, {
        new : true,
        runValidators : true
    })

    console.log(user);

    res.status(200).json({
        status : "success",
        user
    })
})

exports.deleteUser = catchAsync(async (req, res, next) => {

    const user = await User.findById(req.user._id).select("password")

    const correct = await user.correctPassword(req.body.password, user.password)

    if(!correct) {

        return next(new AppError("incorrect password", 401))
    }

    console.log(req.user._id);
    const commentsByUser = await Comment.find({author : req.user._id})

    for (const comment of commentsByUser) {
        await Post.findByIdAndUpdate(comment.post, {$inc : {comments : -1}}, {runValidators : true})
    }

    const likesByUser = await Like.find({author : req.user._id})

    for(const like of likesByUser) {
        console.log(like.post);
        await Post.findByIdAndUpdate(like.post, {$inc : {likes : -1}}, {runValidators : true})
    }
    const post  = await Post.deleteMany({author : req.user._id})
    const comment = await Comment.deleteMany({author : req.user._id})
    const like = await Like.deleteMany({author : req.user._id})    
    console.log(post.deletedCount, comment.deletedCount, like.deletedCount);

    await User.findByIdAndDelete(req.user._id)
    res.status(204).json({
        status : "success",
        message : "user deleted"
    })
})

exports.followUser = catchAsync( async (req, res) => {

    if(!await User.findById(req.params.userId)) {return new AppError("user not found", 404)}

    const user = await User.findById(req.user._id)

    if(user.isFollowing(req.params.userId)) {

        await User.findByIdAndUpdate(req.user._id, {
            $pull : { following : req.params.userId}
        })

        await User.findByIdAndUpdate(req.params.userId, {
            $pull : { followers : req.user._id}
        })

        res.status(200).json({
            status : "success",
            message : "user unfollowed"
        })
    } 
    
    else 
    
    {

        await User.findByIdAndUpdate(req.user._id, {
            $addToSet : { following : req.params.userId}
        })
    
        await User.findByIdAndUpdate(req.params.userId, {
            $addToSet : {followers : req.user._id}
        })
    
        res.status(200).json({
            status : "success",
            message : "following user"
        })
    }


})

exports.userFeed = catchAsync(async(req, res) => {

    const users = await User.getUserFeed(req.user._id)

    res.status(200).json({
        status : "sucess",
        users
    })

})
