const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")
const Request = require("./../models/requestModel")
const User = require("./../models/userModel")

exports.createFollowRequest = catchAsync(async(req, res, next) => {

    // /:requestedUserId/follow

    if(!await User.findById(req.params.userId)) {
        return next(new AppError("user not found", 404))
    }

    const request = await Request.create({
        requested : req.params.userId,
        requester : req.user._id
    })

    res.status(201).json({
        status:  "success",
        message : "request created successfully"
    })
})

exports.deleteFollowRequest = catchAsync(async(req, res, next) => {

    // /:requesteruserId/follow

    // req.body.accept is true or false

    if(!await Request.findOne({requester : req.params.userId, requested : req.user._id})) {
        return next(new AppError("invalid request", 400))
    }

    if(!await User.findById(req.params.userId)) {
        return next(new AppError("user not found", 404))
    }

    if(req.body.accept) {

        await User.findByIdAndUpdate(req.user._id, {
            $addToSet : { followers : req.params.userId}
        })
    
        await User.findByIdAndUpdate(req.params.userId, {
            $addToSet : {following : req.user._id}
        })

        await Request.findOneAndDelete({requester : req.params.userId, requested : req.user._id})
    
        res.status(200).json({
            status : "success",
            message : "request accepted"
        })
    } else {

        await Request.findOneAndDelete({requester : req.params.userId, requested : req.user._id})

        res.status(200).json({
            status : "success",
            message : "request rejected"
        })
    }
    
})