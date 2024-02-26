const User = require("./../models/userModel")
const Post = require("./../models/postModel")
const Comment = require("./../models/commentModel")
const jwt = require("jsonwebtoken")
const {ObjectId} = require("bson")

const AppError = require("../utils/appError")
const catchAsync = require("./../utils/catchAsync")

const crypto = require("crypto")
const sendEmail = require("./../utils/email")

const generateToken = (userId, res) => {

    const token = jwt.sign({id : userId}, process.env.JWT_SECRET, {
            expiresIn : process.env.JWT_EXPIRE
    })

    const cookieOptions = {
        expires : new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly : true
    }

    if(process.env.NODE_ENV === "production") {
        cookieOptions.secure = true
    }
    res.cookie("jwt", token, cookieOptions)

    return token
}

const verify = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET)
}

exports.signup = catchAsync(async (req, res, next) => {

    //console.log("hello");
    const user = await User.create({
        name : req.body.name,
        username : req.body.username,
        email : req.body.email,
        password : req.body.password,
        confirmPassword : req.body.confirmPassword
    })

    const token = generateToken(user._id, res)

    user.password = undefined
    user.admin = undefined
    user.active = undefined
    res.status(201).json({
        status : "success",
        message : "user signed up",
        token,
        user
    })
})

exports.login = catchAsync(async (req, res, next) => {
    
    if(!req.body.email || !req.body.password) {
        return next(new AppError("provide email and password", 400))
    }

    const user = await User.findOne({email : req.body.email}).select("password")

    if (!user) {
        return next(new AppError("Email or password is invalid", 401));
    }

    const correct = await user.correctPassword(req.body.password, user.password)

    if(!user || !correct) {
        return next(new AppError("email or password is invalid", 401))
    }

    const token = generateToken(user._id, res)

    res.status(200).json({
        status : "success",
        message : "user logged in",
        token
    })
})

exports.logout = async(req, res) => {
    try {
        res.cookie("jwt", "userLogout", {
            expires : new Date(Date.now() + 10 * 1000), httpOnly : true
        })

        res.status(200).json({
            status : "success"
        })
    } catch(err) {
        console.log(err);
    }
}

exports.protect = catchAsync(async (req, res, next) => {
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1]
    } else if(req.cookies.jwt) {
        token = req.cookies.jwt
    }

    if(!token) {
        return next(new AppError("user logged out", 401))
    }

    const decoded = verify(token) 

    const freshUser = await User.findById(decoded.id)

    if(!freshUser) {
        return next(new AppError("invalid token", 401))
    }

    if(freshUser.passwordChange(decoded.iat)) {
        return next(new AppError("user recently change password please login again", 401))
    }
    req.user = freshUser
    next()
})

// only for view structure

exports.isLogin = async(req, res, next) => {
    if(req.cookies.jwt) {
        try{

            let token = req.cookies.jwt
    
            const decoded = verify(token) 
    
            const freshUser = await User.findById(decoded.id)
    
            if(!freshUser) {
                return next()
            }
    
            if(freshUser.passwordChange(decoded.iat)) {
                return next()
            }
            res.locals.loginUser = freshUser
            return next()
        } catch(err) {
            return next()
        }
    }
    next()
}

exports.updatePassword = catchAsync(async(req, res, next) => {

    console.log(req.user);
    const freshUser = await User.findById(req.user._id).select("password")
    if(!await freshUser.correctPassword(req.body.oldPassword, freshUser.password)) {
        return next(new AppError("old password is incorrect", 401))
    }

    freshUser.password = req.body.newPassword
    freshUser.confirmNewPassword = req.body.confirmNewPassword
    freshUser.save()

    const token = generateToken(req.user._id, res)

    res.status(200).json({
        status : "success",
        message : "password updated",
        token
    })
})

exports.forgotPassword = catchAsync(async (req, res, next) => {

    const email = req.body.email

    const freshUser = await User.findOne({email})

    if(!freshUser) {
        return next(new AppError("user does not exist", 400))
    }

    console.log(freshUser);

    const resetToken = freshUser.createPasswordResetToken()

    try {
        await freshUser.save({ validateBeforeSave: false });
    } catch (error) {
        console.error("Error saving user:", error);
    }

    console.log(freshUser);

    const resetURL = req.protocol+"://"+req.get("host")+"/api/v1/users/resetPassword/"+resetToken

    console.log(resetURL); console.log(resetToken); 

    const message = "forgot your password ? submit a patch request with a new password and confirm password to url :- " + resetURL + " ." + " if not forgot then please ignore this message"

    try {
        await sendEmail({
        email : freshUser.email,
        subject : "your password reset token valid for 10 minutes",
        message
        })

        return res.status(200).json({
            status : "success",
            message : "Token sent to email"
        })
        //next()
    } catch(err) {
        freshUser.passwordResetToken = undefined
        freshUser.passwordResetExpire = undefined
        await freshUser.save({validateBeforeSave : false})

        return res.status(500).json({
            status : "fail",
            message : "email can't be sent! please try again later"
        })
    }
    //next()
})

exports.resetPassword = catchAsync(async (req, res, next) => {

    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex")

    const freshUser = await User.findOne({
        passwordResetToken : hashedToken,
        passwordResetExpire : {$gt : Date.now()}
    })

    if(!freshUser) {
        return next(new AppError("token is invalid or expired", 401))
    }

    freshUser.password = req.body.password
    freshUser.confirmPassword = req.body.confirmPassword
    freshUser.passwordResetToken = undefined
    freshUser.passwordResetExpire = undefined
    freshUser.save()

    const token = generateToken(freshUser._id, res)

    res.status(200).json({
        status : "success",
        message : "password updated",
        token
    })
})

exports.isAuthorOfComment = catchAsync(async (req, res, next) => {

    const comment = await Comment.findById(req.params.commentId)
    const post = await Post.findById(comment.post)
    //console.log(req.user._id); console.log(post.author);
    const user = await User.findOne({email : req.user.email}).select("admin")
    if(!comment.author.equals(req.user._id) && !req.user._id.equals(post.author) && !user.admin) {
        return next(new AppError("you can't delete others post", 401))
    }
    next()
})

exports.isAuthor = catchAsync(async (req, res, next) => {
    
    const post = await Post.findById(req.params.postId)

    const user = await User.findOne({email : req.user.email}).select("admin")

    if(!post.author.equals(req.user._id) && !user.admin) {
        return next(new AppError("you are not author of this post", 401))
    }
    next()
})

exports.isAuthorOfLike = catchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.postId)
    const auhtor = await User.findById(req.user._id)
    next()
})

exports.checkUser = catchAsync(async (req, res, next) => {

    if(!req.user.admin) {
        return next(new AppError("not permitted", 401))
    }
    next()
})
