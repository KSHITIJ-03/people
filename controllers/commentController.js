const Comment = require("./../models/commentModel")
const Post = require("./../models/postModel")

const AppError = require("../utils/appError")
const catchAsync = require("./../utils/catchAsync")

exports.createComment = catchAsync(async (req, res, next) => {

    const content = req.body.comment
    const author = req.user._id
    const postId = req.params.postId
    const comment = await Comment.create({
        comment : content,
        author : author,
        post : postId
    })

    await Post.findByIdAndUpdate(postId, { $inc : {comments : 1}}, {runValidators : true})
    
    res.status(201).json({
        status : "success",
        comment
    })

})

exports.deleteComment = catchAsync(async (req, res, next) => {
    
    const postId = req.params.postId
    await Post.findByIdAndUpdate(postId, { $inc : {comments : -1}}, {runValidators : true})
    await Comment.findByIdAndDelete(req.params.commentId)
    res.status(204).json({
        status : "success",
        message : "comment deleted"
    })
})