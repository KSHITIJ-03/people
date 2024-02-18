const express = require("express")
const morgan = require("morgan")
const app = express()


const userRouter = require("./routes/userRoutes")
const postRouter = require("./routes/postRoutes")
const commentRouter = require("./routes/commentRoutes")

//const testRouter = require("./routes/testRoutes")

app.use(express.json())
app.use(morgan("dev"))


app.use("/api/v1/users", userRouter)
app.use("/api/v1/posts", postRouter)
app.use("/api/v1/comments", commentRouter)


//app.use("/", testRouter)

app.all("*", (req, res) => {
    res.status(404).json({
        status : "fail",
        message : `can't find ${req.originalUrl} on this server`
    })
})



app.get("/", (req, res) => {
    res.send("hello from the server")
})

module.exports = app
