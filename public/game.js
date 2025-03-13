function checkMoves(idx, dirX=null, dirY=-1) {
    if (dirX == null) {
        if (board[idx] > DARK) {
            return (
                checkMoves(idx, -1)
                .concat(checkMoves(idx, 1))
                .concat(checkMoves(idx, -1, 1))
                .concat(checkMoves(idx, 1, 1))
            );
        }
        
        else {
            return (
                checkMoves(idx, -1)
                .concat(checkMoves(idx, 1))
            )
        }
    }

    let moves = [];
    let pos = idxToPos(idx);
    while (true) {
        pos.y += dirY;
        pos.x += dirX;
        let nextIdx = posToIdx(pos);

        if (nextIdx == undefined) break;
        if (board[nextIdx] != EMPTY) break;
        moves.push(nextIdx);
        if (board[idx] < LIGHT_KING || !rules["long-king-moves"]) break;
    }
    
    return moves;
}

function checkCaptures(idx, dirX=null, dirY=-1) {
    if (dirX == null) {
        if (rules["backwards-capture"] || board[idx] > DARK) {
            return checkCaptures(idx, -1)
            .concat(checkCaptures(idx, 1))
            .concat(checkCaptures(idx, -1, 1))
            .concat(checkCaptures(idx, 1, 1))
        }
        else {
            return checkCaptures(idx, -1)
            .concat(checkCaptures(idx, 1))
        }
    }

    let pos = idxToPos(idx);
    let isCapture = false;
    let moves = [];

    while (true) {
        pos.x += dirX;
        pos.y += dirY;
        let nextIdx = posToIdx(pos);

        if (nextIdx == undefined) break;
        if (isCapture) {
            if (board[nextIdx] != EMPTY) break;
            moves.push(nextIdx);
            if (board[idx] < LIGHT_KING) break;
        }
        if (board[nextIdx] == enemyColor || board[nextIdx] == enemyKing) {
            isCapture = true;
        }
        else if (board[idx] < LIGHT_KING || !rules["long-king-moves"]) break;
    }
    
    return moves;
}

function movePiece(from, to) {
    let isCapture = availableCaptures.includes(to);
    let isMove = availableMoves.includes(to);

    if (!isMove && !isCapture) return false;

    if (isCapture) {
        removeCaptured(from, to);
    }
    if (to < 5 && board[from] < LIGHT_KING) {
        board[to] = board[from] + 2;
    }
    else {
        board[to] = board[from];
    }
    
    board[from] = EMPTY;
    sendMessage("move", {from: from, to: to, isCapture: isCapture});

    return true;
}

function removeCaptured(from, to) {
    let start = idxToPos(from);
    let end = idxToPos(to);
    let dir = {
        x: Math.sign(end.x - start.x),
        y: Math.sign(end.y - start.y)
    };

    while (true) {
        start = {
            x: start.x + dir.x,
            y: start.y + dir.y
        };

        let capturedIdx = posToIdx(start)
        if (board[capturedIdx] != EMPTY) {
            board[posToIdx(start)] = EMPTY;
            break;
        }
    }
}

function moveEnemyPiece(from, to, isCapture) {
    board[49 - to] = board[49 - from];
    board[49 - from] = EMPTY;

    if (isCapture) {
        removeCaptured(49 - from, 49 - to);
    }
}

function setTimers(span, time) {
    let minutes = Math.floor(time / 60).toString();
    let seconds = Math.floor((time % 60)).toString();
    if (seconds.length < 2) {
        seconds = "0" + seconds;
    }
    span.innerText = `${minutes}:${seconds}`;
}

function main_loop() {
    currentTime = (Date.now() - startTime) / 1000;
    setTimers(player1Clock, player1Time - currentTime);
    setTimers(player2Clock, player2Time - currentTime);

    drawBoard();

    if (selectedTile == null) {
        drawCursor(mousePosToIdx(mousePos));
    }
    else {
        drawCursor(selectedTile);
        drawMoves(selectedTile);
    }

    drawPieces(board);
    drawArrowsAndMarkers(arrows);
    // drawCrown(tileSize / 2 + tileSize, tileSize / 2, 1);
    // drawCrown(tileSize / 2, tileSize / 2 + tileSize, 2);
}
