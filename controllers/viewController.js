const catchAsync = require("../utils/catchAsync");
const User = require("./../models/userModel")
const Post = require("./../models/postModel")
const Request = require("./../models/requestModel")

exports.getAllUsers = catchAsync(async(req, res, next) => {

    const users = await User.find()
    res.status(200).render("overview", {
        title : "users",
        users
    })
})

exports.getUser = catchAsync(async(req, res, next) => {

    let followingArray = res.locals.loginUser.following 
    let isFollowing = false; 
    let user = await User.findOne({username : req.params.username})
    for (const element of followingArray) {
        if (element.equals(user._id)) {
            user = await user.populate("posts")
            isFollowing = true
            break
        } 
    }
    let isRequested = false;
    if(await Request.findOne({requester : res.locals.loginUser, requested : user._id})) {
        isRequested = true
    }
    res.status(200).render("user", {
        title : user.username,
        user,
        isFollowing,
        isRequested
    })
})

exports.login = catchAsync(async(req, res, next) => {

    res.status(200).render("login", {
        title : "login"
    })
})

exports.signup = catchAsync(async(req, res, next) => {
    
    res.status(200).render("signup", {
        title : "sign up"
    })
})

exports.getMe = catchAsync(async(req, res, next) => {

    const user = await User.findOne({username : res.locals.loginUser.username}).populate("posts")

    res.status(200).render("account", {
        title : user.username,
        user
    })
})

exports.passwordAndSecurity = catchAsync(async(req, res, next) => {

    res.status(200).render("security", {
        title : "security settings"
    })
})

exports.followRequests = catchAsync(async(req, res, next) => {

    const requests = await Request.find({requested : res.locals.loginUser._id}).populate("requester")
    res.status(200).render("requests", {
        title : "follow requests",
        requests
    })
})

exports.createPost = catchAsync(async(req, res, next) => {
    res.status(200).render("compose", {
        title : "compose"
    })
})

exports.feed = catchAsync(async(req, res, next) => {
    const posts = await Post.find().sort({createdAt : -1}).populate({
        path : "author",
        select : "displayPhoto username _id"
    })
    res.status(200).render("feed", {
        title : "feed",
        posts
    })
})

exports.delete = catchAsync(async(req, res, next) => {
    res.status(200).render("delete", {
        title : "Delete Account"
    })
})