const Comment = require("./../models/commentModel")
const Post = require("./../models/postModel")
exports.createComment = async (req, res) => {
    try {

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
    } catch(err) {
        res.status(404).json({
            status : "fail",
            message : err
        })
    }
}

exports.deleteComment = async (req, res) => {
    try {
        const postId = req.params.postId
        await Post.findByIdAndUpdate(postId, { $inc : {comments : -1}}, {runValidators : true})
        await Comment.findByIdAndDelete(req.params.commentId)
        res.status(204).json({
            status : "success",
            message : "comment deleted"
        })
    } catch(err) {
        res.status(404).json({
            status : "fail",
            message : err
        })
    }
}