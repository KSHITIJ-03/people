const mongoose = require("mongoose")
const path = require("path")
const express = require("express")

const dotenv = require("dotenv")
dotenv.config({path : "./config.env"})


const app = require("./app")

// for socket defining server explicitly
const http = require("http")
const server = http.createServer(app)
const socketio = require("socket.io")
const io = new socketio.Server(server)

const socketLogic = require("./controllers/socketController")

// io.on("connection", (socket) => {
//     console.log("a user is connected");
// })

app.use(socketLogic(io))

//console.log(process.env);

//console.log(process.env.DATABASE);

const DB = process.env.DATABASE.replace("<password>", process.env.DATABASE_PASSWORD)

//console.log(DB);

mongoose.connect(DB).then(con => {
    //console.log(con.connections);
    console.log("databse connected");
})

const PORT = process.env.PORT || 3000

server.listen(PORT, () =>{
    console.log("server started at port : " + PORT);
})

module.exports = io