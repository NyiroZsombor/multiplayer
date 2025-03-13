function idxToPos(idx) {
    offset = Math.floor(idx / 5) % 2 == 0 ? 1 : 0;
    return {
        x: (idx % 5) * 2 + offset,
        y: Math.floor(idx / 5)
    };
}

function posToIdx(pos) {
    if (pos.x % 2 == pos.y % 2) return undefined;
    if (pos.x >= 10 || pos.x < 0 || pos.y >= 10 || pos.y < 0) return undefined;
    return Math.floor(pos.x / 2) + pos.y * 5;
}

function mousePosToIdx(pos) {
    x = Math.floor(pos.x / tileSize);
    y = Math.floor(pos.y / tileSize);
    if (x % 2 == y % 2) return undefined;
    return Math.floor(x / 2) + y * 5;
}

function resizeCanvas(canvas) {
    if (window.innerHeight > 620 && window.innerWidth > 620) {
        canvas.width = canvas.height = 500;
    }
    else {
        canvas.width = canvas.height = 300;
    }

    tileSize = canvas.width / 10;
}

function setUpBoard() {
    board.length = 0;
    for (let i = 0; i < 50; i++) {
        if (i < 20) board.push(enemyColor);
        else if (i < 30) board.push(0);
        else board.push(socket.playerColor);
    }

    // for (let i = 0; i < 50; i++) {
    //     board.push(0);
    // }

    // board[0] = LIGHT_KING;
    // board[5] = DARK;
    // board[12] = DARK;
    // board[22] = DARK;
    // board[21] = DARK;
    // board[27] = LIGHT;
    // board[40] = LIGHT;
}

function setUpEventListeners() {
    canvas.addEventListener("mousemove", e => {
        mousePos.x = e.offsetX;
        mousePos.y = e.offsetY;
    });
    
    canvas.addEventListener("mouseleave", () => {
        mousePos.x = null;
        mousePos.y = null;
    });
    
    canvas.addEventListener("mousedown", e => {
        // sendMessage("random", {"asd":2, "c": 23});
        mousePos.x = e.offsetX;
        mousePos.y = e.offsetY;
        let currentTile = mousePosToIdx(mousePos);
    
        if (!e.shiftKey) {
            arrows.length = 0;
            if (selectedTile == null && (board[currentTile] == socket.playerColor
            || board[currentTile] == socket.playerColor + 2)) {
                selectedTile = currentTile;
                availableMoves = checkMoves(selectedTile);
                availableCaptures = checkCaptures(selectedTile);
    
                // console.log("moves:", availableMoves);
                // console.log("captures:", availableCaptures);
            }
            else {
                movePiece(selectedTile, currentTile);
                selectedTile = null;
            }
        }
        else {
            arrows.push({
                x: Math.floor(mousePos.x / tileSize),
                y: Math.floor(mousePos.y / tileSize)
            });
        }
    });
    
    canvas.addEventListener("mouseup", e => {
        if (arrows.length % 2 == 1) {
            arrows.push({
                x: Math.floor(mousePos.x / tileSize),
                y: Math.floor(mousePos.y / tileSize)
            });
        }
    });
    
    window.addEventListener("resize", () => {
        resizeCanvas(canvas);
    });
    
}

let canvas = document.getElementById("canvas");
let tileSize = canvas.width / 10;
resizeCanvas(canvas);

const ctx = canvas.getContext("2d");
const mousePos = {x: null, y: null};
let selectedTile = null;

const startTime = Date.now();
let currentTime = 0;
let player1Time = 300;
let player2Time = 300;
const player1Clock = document.getElementById("this-clock");
const player2Clock = document.getElementById("other-clock");

const lightBoardColor = "#DB7";
const darkBoardColor = "#864";
const lightColor = "lightgoldenrodyellow";
const darkColor = "#444";
const accentColor = "#AFA8";
const moveColor = "#888";
const captureColor = "#A77";
const arrowColor = "#D93B";

const EMPTY = 0;
const LIGHT = 1;
const DARK = 2;
const LIGHT_KING = 3;
const DARK_KING = 4;

let enemyColor = DARK;
let enemyKing = DARK_KING;

rules = {
    "backwards-capture": true,
    "long-king-moves": true,
    "forced-capture": false
}

const board = [];
const arrows = [];
let availableMoves = [];
let availableCaptures = [];
