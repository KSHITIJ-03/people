const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
    name : {
        type : String,
        require : [true, "name of post is required"]
    },
    caption : {
        type : String
    },
    tags : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }],
    createdAt : Date,
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        require : [true, "a post must have an author"]
    },
    likes : {
        type : Number,
        default : 0
    }
})

postSchema.pre("save", function(next) {
    this.createdAt = Date.now()
    next()
})

const Post = new mongoose.model("Post", postSchema)

module.exports = Post
