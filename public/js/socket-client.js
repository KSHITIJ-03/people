const socket = io()

socket.on("message", message => {
    console.log("hello");
    console.log("message");
})