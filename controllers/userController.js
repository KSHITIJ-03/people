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