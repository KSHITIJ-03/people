const User = require("./../models/userModel")

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find()

        res.status(200).json({
            status : "success",
            count : users.length,
            users
        })
    } catch(err) {
        res.status(404).json({
            status : "fail",
            message : err
        })
    }
}

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("posts")

        res.status(200).json({
            status : "success",
            user
        })
    } catch(err) {
        res.status(404).json({
            status : "fail",
            message : err
        })
    }
}

exports.updateMe = async (req, res) => {
    try {
        //console.log(req.user);
        if(req.body.password){
            return res.status(400).json({
                status : "fail",
                message : "password do not update here"
            })
        }
        const user = await User.findOneAndUpdate({email : req.user.email}, {email : req.body.email}, {
            new : true,
            runValidators : true
        })

        console.log(user);

        res.status(200).json({
            status : "success",
            user
        })

    } catch(err) {
        res.status(404).json({
            status : "fail",
            message : err
        })
    }
}

exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user._id)
        res.status(204).json({
            status : "success",
            message : "user deleted"
        })
    } catch(err) {
        res.status(404).json({
            status : "fail",
            message : err
        })
    }
}