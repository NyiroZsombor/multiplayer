function drawBoard() {
    const fontSize = 10;
    ctx.font = fontSize + "px Monospace";

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            let color = lightBoardColor;
            if ((i + j) % 2 == 1) {
                color = darkBoardColor
            }
            
            let x = j * tileSize;
            let y = i * tileSize;

            ctx.fillStyle = color;
            ctx.fillRect(x, y, tileSize, tileSize);

            if (i % 2 == j % 2) continue;
            let offset = 0;
            if (j % 2 == 1) offset = 1;
            let boardNum = (j + i * 10 + offset) / 2 - offset + 1;
            if (socket.playerColor == LIGHT) {
                boardNum = 51 - boardNum;
            }
            ctx.fillStyle = lightBoardColor;
            ctx.fillText(boardNum, x + 2, y + fontSize + 2);
        }
    }
}

function drawCursor(idx, type="select") {
    if (idx == null) return;

    pos = idxToPos(idx);
    let x = pos.x * tileSize;
    let y = pos.y * tileSize;

    if (type == "select") {
        ctx.fillStyle = accentColor;
        ctx.fillRect(x, y, tileSize, tileSize);
    }
    else if (type == "move") {
        x += tileSize / 2;
        y += tileSize / 2;
        ctx.fillStyle = moveColor;
        ctx.beginPath();
        ctx.arc(x, y, tileSize / 4, 0, Math.PI * 2);
        ctx.fill();
    }
    else if (type == "capture") {
        x += tileSize / 2;
        y += tileSize / 2;
        ctx.fillStyle = captureColor;
        ctx.beginPath();
        ctx.arc(x, y, tileSize / 4, 0, Math.PI * 2);
        ctx.fill();
    }
    else {
        console.error("invalid cursor type");
    }
}

function drawMoves() {
    if (board[selectedTile] == socket.playerColor || board[selectedTile] == socket.player + 2) {
        for (let move of availableMoves) {
            drawCursor(move, "move");
        }
        for (let move of availableCaptures) {
            drawCursor(move, "capture");
        }
    }
}

function drawCrown(x, y, player) {
    ctx.lineWidth = 1;
    stroke = darkColor;
    color = "#DC6";
    if (player == DARK) {
        stroke = lightColor;
        color = "#A96";
    }
    u = tileSize * 1 / 12;
    x -= u * 4;
    y -= u * 3.5;
    ctx.fillStyle = color;
    ctx.strokeStyle = stroke;
    ctx.beginPath();
    ctx.moveTo(x + u * 2, y + u * 2);
    ctx.lineTo(x + u * 3, y + u * 3);
    ctx.lineTo(x + u * 4, y + u * 2);
    ctx.lineTo(x + u * 5, y + u * 3);
    ctx.lineTo(x + u * 6, y + u * 2);
    ctx.lineTo(x + u * 6, y + u * 5);
    ctx.lineTo(x + u * 2, y + u * 5);
    ctx.lineTo(x + u * 2, y + u * 2);
    ctx.fill();
    ctx.stroke();
}

function drawPieces(board) {
    for (let i = 0; i < board.length; i++) {
        if (board[i] == EMPTY) {
            continue;
        }

        let color = lightColor;
        if (board[i] == DARK) {
            color = darkColor;
        }
        pos = idxToPos(i);
        let x = pos.x * tileSize + tileSize / 2;
        let y = pos.y * tileSize + tileSize / 2;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, tileSize * 1 / 3, 0, Math.PI * 2);
        ctx.fill();

        if (board[i] > DARK) {
            drawCrown(x, y, board[i] - 2);
        }
    }
}

function drawMarker(pos) {
    let x = pos.x * tileSize + tileSize / 2;
    let y = pos.y * tileSize + tileSize / 2;
    
    ctx.lineWidth = 6;
    ctx.strokeStyle = arrowColor;
    ctx.beginPath();
    ctx.arc(x, y, tileSize / 2 - 6, 0, Math.PI * 2);
    ctx.stroke();
}

function drawArrow(start, end) {
    let startX = start.x * tileSize + tileSize / 2;
    let startY = start.y * tileSize + tileSize / 2;
    let endX = end.x * tileSize + tileSize / 2;
    let endY = end.y * tileSize + tileSize / 2;

    ctx.lineWidth = 6;
    ctx.strokeStyle = arrowColor;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
}

function drawArrowsAndMarkers(arrows) {
    for (let i = 0; i < arrows.length; i += 2) {
        start = arrows[i];
        end = arrows[i + 1];

        if (end == undefined) return;
        if (start.x == end.x && start.y == end.y) {
            drawMarker(start);
        }
        else {
            drawArrow(start, end);
        }
    }
}
