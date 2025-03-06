const express = require("express");
const WebSokcet = require("ws");
const http = require("http");

const app = express();
const server = http.createServer(app);
const wss = new WebSokcet.Server({server});

app.use(express.static("public"));

wss.on("connection", socket => {
    console.log("a player connected");

    socket.on("message", data => {
        wss.clients.forEach(client => {
            if (client.readyState === WebSokcet.OPEN) {
                client.send(data.toString());
            }
        });
    });

    socket.on("close", () => console.log("a player disconnected"));
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log("server is listening on http://localhost:3000"));