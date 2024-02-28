const catchAsync = require("../utils/catchAsync");
const User = require("./../models/userModel")

exports.getAllUsers = catchAsync(async(req, res, next) => {

    const users = await User.find()
    res.status(200).render("overview", {
        title : "users",
        users
    })
})

exports.getUser = catchAsync(async(req, res, next) => {

    const user = await User.findOne({username : req.params.username}).populate("posts")
    res.status(200).render("user", {
        title : user.username,
        user
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

exports.createPost = catchAsync(async(req, res, next) => {

    res.status(200).render("compose", {
        title : "compose"
    })
})