const socket = new WebSocket("ws://" + window.location.hostname);

socket.onopen = () => {
    console.log("connected to server");
}

socket.onmessage = event => {
    console.log("> ", event.data);
    addMessage(event.data);
}

function send(msg) {
    socket.send(msg);
}

function addMessage(msg) {
    const li = document.createElement("li");
    li.innerHTML = msg;
    ul.appendChild(li);   
    ul.scrollTop = ul.scrollHeight;
}

addEventListener("DOMContentLoaded", () => {
    const enter = document.getElementById("enter");
    ul = document.getElementById("msgs");

    enter.addEventListener("keydown", event => {
        if (event.code.toLowerCase() == "enter") {
            event.preventDefault();
            send(enter.value);

            enter.value = "";
        }
    });
});

ul = null;