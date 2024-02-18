const User = require("./../models/userModel")
const Post = require("./../models/postModel")
const Comment = require("./../models/commentModel")
const Like = require("./../models/likeModel")
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find()

        res.status(200).json({
            status : "success",
            count : users.length,
            users
        })
    } catch(err) {
        res.status(404).json({
            status : "fail",
            message : err
        })
    }
}

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("posts")

        res.status(200).json({
            status : "success",
            user
        })
    } catch(err) {
        res.status(404).json({
            status : "fail",
            message : err
        })
    }
}

exports.updateMe = async (req, res) => {
    try {
        //console.log(req.user);
        if(req.body.password){
            return res.status(400).json({
                status : "fail",
                message : "password do not update here"
            })
        }
        const user = await User.findOneAndUpdate({email : req.user.email}, {email : req.body.email}, {
            new : true,
            runValidators : true
        })

        console.log(user);

        res.status(200).json({
            status : "success",
            user
        })

    } catch(err) {
        res.status(404).json({
            status : "fail",
            message : err
        })
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("password")

        const correct = await user.correctPassword(req.body.password, user.password)

        if(!correct) {
            return res.status(401).json({
                status : "fail",
                message : "incorrect Password"
            })
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
    } catch(err) {
        res.status(404).json({
            status : "fail",
            message : err
        })
    }
}