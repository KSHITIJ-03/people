const socketLogic = (io) => {
    //console.log("hello from the socketLogic");
    //console.log(io);
    io.on("connection", (socket) => {
        console.log("a user is connected");
        socket.emit("message", "Welcome to the chat");
        socket.on("dissconect", () => {
            console.log("a user is disconnected");
        })
        
        socket.on("chatMessage", (message) => {
            io.emit("message", message)
        })
    });
    return (req, res, next) => {
        next()
    }
}

module.exports = socketLogic
