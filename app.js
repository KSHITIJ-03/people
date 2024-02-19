const express = require("express")
const morgan = require("morgan")
const app = express()


const userRouter = require("./routes/userRoutes")
const postRouter = require("./routes/postRoutes")
const commentRouter = require("./routes/commentRoutes")

const errorController = require("./controllers/errorController")

const appError = require("./utils/appError")

//const testRouter = require("./routes/testRoutes")

app.use(express.json())
app.use(morgan("dev"))


app.use("/api/v1/users", userRouter)
app.use("/api/v1/posts", postRouter)
app.use("/api/v1/comments", commentRouter)


//app.use("/", testRouter)

app.all("*", (req, res, next) => {
    // res.status(404).json({
    //     status : "fail",
    //     message : `can't find ${req.originalUrl} on this server`
    // })
    // const err = new Error(`can't find ${req.originalUrl} on this server`)
    // err.statusCode = 404
    // err.status = "fail"
    // next(err)

    next(new appError(`can't find ${req.originalUrl} on this server`, 404))

})

app.use(errorController)



app.get("/", (req, res) => {
    res.send("hello from the server")
})

module.exports = app
