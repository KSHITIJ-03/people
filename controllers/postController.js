const Post = require("./../models/postModel")

exports.createPost = async(req, res) => {
    try {

        const name = req.body.name
        const tags = req.body.tags
        const author = req.user._id
        const caption = req.body.caption
        const post = await Post.create({name, tags, author, caption})

        res.status(201).json({
            status : "success",
            message : "post uploaded",
            post
        })
    } catch(err) {
        res.status(404).json({
            status : "fail",
            message : err
        })
    }
}

exports.deletePost = async(req, res) => {
    try {
        console.log("hello");
        const post = await Post.findByIdAndDelete(req.params.postId)
        console.log(post);
        res.status(204).json({
            status : "success",
            message : "post deleted"
        })
    } catch(err) {
        res.status(404).json({
            status : "fail",
            message : err
        })
    }
}