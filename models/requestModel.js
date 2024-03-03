const mongoose = require("mongoose")

const requestSchema = new mongoose.Schema({
    requester : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    requested : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    requestedAt : Date
})

requestSchema.pre("save", function(next) {
    this.requestedAt = Date.now()
    next()
})

const Request = mongoose.model("Request", requestSchema)

module.exports = Request