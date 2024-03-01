const Post = require("./../models/postModel")
const User = require("./../models/userModel")
const Like = require("./../models/likeModel")
const Comment = require("./../models/commentModel")
const AppError = require("../utils/appError")
const catchAsync = require("./../utils/catchAsync")
const multer = require("multer")
const sharp = require("sharp")

exports.createPost = catchAsync(async(req, res, next) => {

    let photo

    if(req.file) {
        photo = req.file.filename
    }

    const tagString = req.body.tags.trim();
    const taggedUsers = tagString.split(',').map(tag => tag.trim());
    const users = [];

    const getUsers = async () => {
        for (const taggedUser of taggedUsers) {
            try {
                const user = await User.findOne({ username: taggedUser });
                if (user) {
                    users.push(user._id);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        }
    }

    await getUsers()

    const content = req.body.content
    const tags = users
    const author = req.user._id
    const caption = req.body.caption
    const post = await Post.create({content, tags, author, caption, photo})

    await User.findByIdAndUpdate(author, {$inc :{postCount : 1}}, {runValidators : true})

    res.status(201).json({
        status : "success",
        message : "post uploaded",
        post
    })
})

exports.deletePost = catchAsync(async(req, res, next) => {

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
})