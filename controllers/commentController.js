const Comment = require("./../models/commentModel")

exports.createComment = async (req, res) => {
    try {

        const content = req.body.comment
        const author = req.user._id
        const post = req.params.postId
        const comment = await Comment.create({
            comment : content,
            author : author,
            post : post
        })

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