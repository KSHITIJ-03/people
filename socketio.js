const socketLogic = (io) => {
    //console.log("hello from the socketLogic");
    //console.log(io);
    io.on("connection", (socket) => {
        console.log("New user connected");
        socket.emit("message", "Welcome to the chat");
    });
    return (req, res, next) => {
        next()
    }
}

module.exports = socketLogic
