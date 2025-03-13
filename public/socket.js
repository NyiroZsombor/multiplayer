let socket;

async function receiveHelloMessage() {
    return new Promise(resolve => {
        socket.addEventListener("message", function handler(event) {

            let data = JSON.parse(event.data);
            if (data.type == "hello-message") {
                socket.socketId = data.socketId;
                socket.roomId = data.roomId;
                socket.playerColor = data.playerColor;
                console.log("received hello message:");
                console.log(data);
            
                socket.removeEventListener("message", handler);
                socket.addEventListener("message", socketOnMessage);

                resolve();
            }
        });
    });
}

function socketOnMessage(event) {
    let data = JSON.parse(event.data);

    if (data.type == "move") {
        moveEnemyPiece(data.from, data.to, data.isCapture);
        let symbol = "-";
        if (data.isCapture) symbol = "x";
        console.log(`${data.from}${symbol}${data.to}`);
    }
    else {
        console.log("server:", data);
    }
}

async function initSocket(tryHTTP=false) {
    if (!tryHTTP) {
        socket = new WebSocket("wss://" + window.location.host);
    }
    else {
        socket = new WebSocket("http://" + window.location.host);
    }

    socket.addEventListener("open", () => {
        console.log("connected to server");
    });

    socket.addEventListener("close", event => {
        console.error("error", event.code + ":", event.reason);
        if (!tryHTTP) {
            console.error("failed to connect to server with wss. trying http.");
            initSocket(tryHTTP=true);
            return;
        }
        else {
            console.error("failed to connect to server with http.");
        }
    });

    await receiveHelloMessage();

    if (socket.playerColor == DARK) {
        enemyColor = LIGHT;
        enemyKing = LIGHT_KING;
    }

    setUpBoard();
    setUpEventListeners();
    setInterval(main_loop, 50);
}

function sendMessage(type, msg) {
    socket.send(JSON.stringify({
        type: type, ...msg
    }));
}

function sendChatMessage(msg) {
    sendMessage("chat-message", {msg: msg});
}

initSocket();
