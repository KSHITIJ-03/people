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

//const io = require("./server")
const http = require("http")
const server = http.createServer(app)
const socketio = require("socket.io")
const io = new socketio.Server(server)
const socketLogic = require("./socketio")

app.set("view engine", "pug")
app.set("views", path.join(__dirname, "views"))

app.use(express.static(path.join(__dirname, "public")))

app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev"))

app.use((req, res, next) => {
    //console.log(req.cookies);
    next()
})

app.get("/", (req, res) => {
    res.send("hello from the server")
})

app.use(socketLogic(io))  // socketLogic

app.use("/", viewRouter)

app.use("/api/v1/users", userRouter)
app.use("/api/v1/posts", postRouter)
app.use("/api/v1/comments", commentRouter)

app.all("*", (req, res, next) => {
    next(new appError(`can't find ${req.originalUrl} on this server`, 404))
})

app.use(errorController)

module.exports = app
