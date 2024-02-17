const User = require("./../models/userModel")
const Post = require("./../models/postModel")
const Comment = require("./../models/commentModel")
const jwt = require("jsonwebtoken")
const {ObjectId} = require("bson")


const crypto = require("crypto")
const sendEmail = require("./../utils/email")

const generateToken = (userId) => {

    const token = jwt.sign({id : userId}, process.env.JWT_SECRET, {
            expiresIn : process.env.JWT_EXPIRE
    })

    return token
}

const verify = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET)
}

exports.signup = async (req, res) => {
    try {
        console.log("hello");
        const user = await User.create({
            name : req.body.name,
            email : req.body.email,
            password : req.body.password,
            confirmPassword : req.body.confirmPassword
        })

        const token = generateToken(user._id)

        user.password = undefined
        user.admin = undefined
        user.active = undefined
        res.status(201).json({
            status : "success",
            message : "user signed up",
            token,
            user
        })
    } catch(err) {
        res.status(400).json({
            status : "fail",
            message : err
        })
    }
}

exports.login = async (req, res) => {
    try {

       if(!req.body.email || !req.body.password) {
        return res.status(400).json({
            status : "fail",
            message : "provide email and password both"
        })
       }

    //    if(!await User.findOne({email : req.body.email})) {
    //     return res.status(404).json({
    //         status : "fail",
    //         message : "user do not exist"
    //     })
    //    }

       const user = await User.findOne({email : req.body.email}).select("password")

       const correct = await user.correctPassword(req.body.password, user.password)

       if(!user || !correct) {
        return res.status(401).json({
            status : "unauthorized",
            message : "email or password is invalid"
        })
       }

       const token = generateToken(user._id)

       res.status(200).json({
        status : "success",
        message : "user logged in",
        token
       })
    } catch(err) {
        res.status(404).json({
            status : "fail",
            message : err
        })
    }
}

exports.protect = async (req, res, next) => {
    try {
        let token
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1]
        }

        if(!token) {
            return res.status(401).json({
                status : "fail",
                message : "user logged out"
            })
        }

        const decoded = verify(token) 

        // if(!decoded) {
        //     return res.status(400).json({
        //         status : "fail",
        //         message : "ivalid token"
        //     })
        // }
        
        //console.log(decoded)

        const freshUser = await User.findById(decoded.id)

        if(!freshUser) {
            return res.status(401).json({
                status : "fail",
                message : "invald token"
            })
        }

        //console.log(freshUser);

        if(freshUser.passwordChange(decoded.iat)) {
            return res.status(401).json({
                status : "fail",
                message : "user password change recently please login again"
            })
        }
        req.user = freshUser
        next()
    } catch (err) {
        res.status(404).json({
            status : "fail",
            message : err
        })
    }
}

exports.updatePassword = async(req, res) => {
    try {
        console.log(req.user);
        const freshUser = await User.findById(req.user._id).select("password")
        if(!await freshUser.correctPassword(req.body.oldPassword, freshUser.password)) {
            return res.status(401).json({
                status : "fail",
                message : "old password is incorrect"
            })
        }

        freshUser.password = req.body.newPassword
        freshUser.confirmNewPassword = req.body.confirmNewPassword
        freshUser.save()

        const token = generateToken(req.user._id)

        res.status(200).json({
            status : "success",
            message : "password updated",
            token
        })
    } catch(err) {
        res.status(404).json({
            status : "fail",
            message : err
        })
    }
}

exports.forgotPassword = async (req, res) => {
    try {
        const email = req.body.email

        const freshUser = await User.findOne({email})

        if(!freshUser) {
            return res.status(400).json({
                status : "fail",
                message : "user does not exist"
            })
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
        
    } catch(err) {
        res.status(404).json({
            status : "fail",
            message : err
        })
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex")

        const freshUser = await User.findOne({
            passwordResetToken : hashedToken,
            passwordResetExpire : {$gt : Date.now()}
        })

        if(!freshUser) {
            return res.status(401).json({
                status : "fail",
                message : "token is invalid or expired"
            })
        }

        freshUser.password = req.body.password
        freshUser.confirmPassword = req.body.confirmPassword
        freshUser.passwordResetToken = undefined
        freshUser.passwordResetExpire = undefined
        freshUser.save()

        const token = generateToken(freshUser._id)

        res.status(200).json({
            status : "success",
            message : "password updated",
            token
        })

    } catch(err) {
        res.status(404).json({
            status : "fail",
            message : err
        })
    }
}

exports.isAuthorOfComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId)
        const post = await Post.findById(comment.post)
        //console.log(req.user._id); console.log(post.author);
        const user = await User.findOne({email : req.user.email}).select("admin")
        if(!comment.author.equals(req.user._id) && !req.user._id.equals(post.author) && !user.admin) {
            return res.status(401).json({
                status : "fail",
                message : "you can't delete others comment"
            })
        }
        next()
    } catch(err) {
        res.status(404).json({
            status : "fail",
            message : err
        })
    }
}

exports.isAuthor = async (req, res, next) => {
    try {
        //console.log("hello"); console.log(req.params.postId);
        const post = await Post.findById(req.params.postId)

        console.log(post);
        //console.log(post);
        //console.log(req.user._id); console.log(post.author);
        //console.log(req.user.admin); console.log(req.user);

        //console.log(req.user._id.toHexString());

        //console.log(req.user.email);

        const user = await User.findOne({email : req.user.email}).select("admin")

        //console.log(user);

        if(!post.author.equals(req.user._id) && !user.admin) {
            return res.status(401).json({
                status : "fail",
                message : "you are not author of this post"
            })
        }
        next()
    } catch(err) {
        res.status(404).json({
            status : "fail",
            message : err
        })
    }
}

exports.isAuthorOfLike = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.postId)
        const auhtor = await User.findById(req.user._id)
        next()
    } catch(err) {
        res.status(404).json({
            status : "fail",
            message : err
        })
    }
}

exports.checkUser = async (req, res, next) => {
    try {
        if(!req.user.admin) {
            return res.status(401).json({
                status : "fail",
                message : "not permitted"
            })
        }
        next()
    } catch(err) {
        res.status(404).json({
            status : "fail",
            message : err
        })
    }
}
