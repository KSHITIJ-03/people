const express = require("express")
const morgan = require("morgan")
const app = express()
const path = require("path")
const cookieParser = require("cookie-parser")

const userRouter = require("./routes/userRoutes")
const postRouter = require("./routes/postRoutes")
const commentRouter = require("./routes/commentRoutes")
const viewRouter = require("./routes/viewRoutes")

const errorController = require("./controllers/errorController")

const appError = require("./utils/appError")

app.set("view engine", "pug")
app.set("views", path.join(__dirname, "views"))

app.use(express.static(path.join(__dirname, "public")))

app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev"))

app.use((req, res, next) => {
    console.log(req.cookies);
    next()
})

app.use("/", viewRouter)

app.use("/api/v1/users", userRouter)
app.use("/api/v1/posts", postRouter)
app.use("/api/v1/comments", commentRouter)

app.all("*", (req, res, next) => {
    next(new appError(`can't find ${req.originalUrl} on this server`, 404))
})

app.use(errorController)

app.get("/", (req, res) => {
    console.log(req.cookies);
    res.send("hello from the server")
})

module.exports = app
