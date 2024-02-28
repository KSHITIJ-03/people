const Like = require("./../models/likeModel")
const Post = require("./../models/postModel")

const {ObjectId} = require("bson")

const AppError = require("../utils/appError")
const catchAsync = require("./../utils/catchAsync")

exports.doLike = catchAsync(async (req, res, next) => {

    const like = await Like.findOne({author : req.user._id.toHexString(), post : req.params.postId})

    //console.log(like);users

    if(like) {
        await Like.findByIdAndDelete(like._id)
        const post = await Post.findByIdAndUpdate(req.params.postId, {$inc : {likes : -1}}, {runValidators : true})
        return res.status(201).json({
            status : "success",
            message : "like removed successfully"
        })
    }
    await Like.create({
        post : req.params.postId, 
        author : req.user._id
    })
    await Post.findByIdAndUpdate(req.params.postId, {$inc : {likes : 1}}, {runValidators : true})
    return res.status(201).json({
        status : "success",
        message : "like done"
    })

    return next(new AppError("something went wrong"), 500)
})

// exports.removeLike = async (req, res) => {
//     try {
//         await Like.findByIdAndDelete()
//         res.status(201).json({
//             status : "success",
//             message : "like done"
//         })
//     } catch(err) {
//         res.status(404).json({
//             status : "fail",
//             message : err
//         })
//     }
// }