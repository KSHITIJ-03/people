const User = require("./../models/userModel")


const socketLogic = (io) => {
    //console.log("hello from the socketLogic");
    //console.log(io);
    io.on("connection", (socket) => {

        socket.on("joinRoom", (username) => {
            //const user = userJoin(socket.id, username, room)

            socket.join(username)

            // showUsers()

            // io.to(user.room).emit("roomUsers", {
            //     room : user.room,
            //     users : usersInRoom(user.room)
            // })

            console.log("a user connected");
            //socket.emit("message", "welcome to the chat") // this is emmtied form server to user
            socket.broadcast.to(username).emit("message", `${username} is online`)
        })

        socket.on("dissconect", () => {
            console.log("a user is disconnected");
        })
        
        socket.on("chatMessage", ({message, username}) => {
            console.log(socket.id);
            io.to(username).emit("message", message)
        })
    });
    return (req, res, next) => {
        next()
    }
}

module.exports = socketLogic
