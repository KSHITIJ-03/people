const socket = io()
const messagesForm = document.getElementById("messagesForm")

socket.on("message", message => {
    console.log(message);
    outputMessage(message)
    chatMessages.scrollTop = chatMessages.scrollHeight
})


messagesForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const msg = e.target.elements.msg.value
    console.log(msg);

    socket.emit("chatMessage", (msg))
    e.target.elements.msg.value = ""
    e.target.elements.msg.focus()
})

function outputMessage (message) {
    const div = document.createElement("div")
    div.classList.add("message")
    div.innerHTML = `<p> ${message} </p>`

    document.querySelector(".chat-messages").appendChild(div)
}