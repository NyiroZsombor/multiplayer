function newRoom(socket) {
    if (socket) {
        socket.roomId = nextRoomId;
        rooms[nextRoomId] = [socket];
        socket.playerColor = LIGHT;
        freeRooms.push(nextRoomId)
    }
    else {
        rooms[nextRoomId] = [];
    }
    nextRoomId++;
    return nextRoomId - 1;
}

function toRoom(roomId, type, msg) {
    for (let i = 0; i < rooms[roomId].length; i++) {
        if (rooms[roomId][i].readyState == WebSocket.OPEN) {
            toSocket(rooms[roomId][i], type, msg);
        }
        else {
            console.error("could not send message to socket");
        }
    } 
}

function toSocket(socket, type, msg) {
    socket.send(JSON.stringify({type: type, ...msg}));
}

const express = require("express");
const WebSocket = require("ws");
const http = require("http");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({server});

const LIGHT = 1;
const DARK = 2;

let nextRoomId = 0;
let nextSocketId = 0;
let freeRooms = [];
const rooms = {};

app.use(express.static("public"));

wss.on("connection", socket => {
    socket.socketId = nextSocketId;
    nextSocketId++;
    console.log("a player connected");

    if (freeRooms.length > 0) {
        socket.roomId = freeRooms.pop();
        socket.playerColor = DARK;
        rooms[socket.roomId].push(socket);
    }
    else {
        newRoom(socket);
    }

    toSocket(socket, "hello-message", {
        "roomId": socket.roomId,
        "socketId": socket.socketId,
        "playerColor": socket.playerColor
    })

    socket.on("message", data => {
        // console.log(`room ${socket.roomId}: ${data}`);
        data = JSON.parse(data);
        if (data.type == "move") {
            let targetSide = (socket.playerColor) % 2;
            let target = rooms[socket.roomId][targetSide];
            toSocket(target, "move", {from: data.from, to: data.to, isCapture: data.isCapture});
        }
        else if (data.type == "chat-message") {
            toRoom(socket.roomId, "chat-message", {msg: data.msg, senderId: socket.socketId});
        }
        // wss.clients.forEach(client => {
        //     if (client.readyState == WebSocket.OPEN) {
        //         client.send(data.toString());
        //     }
        // });
    });

    
    socket.on("close", () => {
        if (rooms[socket.roomId].length == 1) {
            freeRooms.splice(freeRooms.indexOf(socket.roomId), 1);
            delete rooms[socket.roomId];
        }
        else {
            let idx = rooms[socket.roomId].indexOf(socket);
            rooms[socket.roomId].splice(idx, 1);
            rooms[socket.roomId][0].playerColor = 0;
            freeRooms.push(socket.roomId);
            toRoom(socket.roomId, "disconnect", {});
        }
        console.log("a player disconnected");
    });
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log("server is listening on port " + port));