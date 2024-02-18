const Post = require("./../models/postModel")
const User = require("./../models/userModel")
const Like = require("./../models/likeModel")
const Comment = require("./../models/commentModel")
exports.createPost = async(req, res) => {
    try {

        const name = req.body.name
        const tags = req.body.tags
        const author = req.user._id
        const caption = req.body.caption
        const post = await Post.create({name, tags, author, caption})

        await User.findByIdAndUpdate(author, {$inc :{postCount : 1}}, {runValidators : true})

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
        //console.log("hello");
        //console.log(req.params.postId);
        const post = await Post.findById(req.params.postId)
        const author = post.author
        //console.log(author);
        await Comment.deleteMany({post : req.params.postId})
        await Like.deleteMany({post : req.params.postId})
        await Post.findByIdAndDelete(req.params.postId)
        //console.log(req.params.postId);
        await User.findByIdAndUpdate(author, {$inc :{postCount : -1}}, {runValidators : true})
        //console.log(post);
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