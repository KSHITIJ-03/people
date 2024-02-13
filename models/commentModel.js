const mongoose = require("mongoose")
const validator = require("validator")

const commentSchema = new mongoose.Schema({
    comment : {
        type : String,
        required : [true, "comment can't be blank"]
    },
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        require : [true, "author is required"]
    },
    post : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Post",
        require : [true, "review is must be of a post"]
    },
    createdAt : Date
})

commentSchema.pre("save", function(next) {
    this.createdAt = Date.now()
    next()
})

const Comment = new mongoose.model("Comment", commentSchema)

module.exports = Comment