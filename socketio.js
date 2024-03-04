const io = require("./server")

io.on("connection", (socket) => {
    console.log("new user connected");
    console.log(socket);
    socket.emit("message", "welcome to chat")
})