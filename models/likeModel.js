const mongoose = require("mongoose")

const likeSchema = new mongoose.Schema({
    post : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Post",
        require : [true, "like should be on a post"]
    },
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        require : [true, "like should be given by a user"]
    },
    createdAt : Date
})

likeSchema.pre("save", function(next) {
    this.createdAt = Date.now()
    next()
})

const Like = new mongoose.model("Like", likeSchema)

module.exports = Like