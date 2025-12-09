import { isAbleToAuthenticate, setIsAbleToAuthenticate } from "../BadUIComponents";

export const tetrisCode = (canvas, typeOfGameMode) => {
    const graphics = canvas.getContext("2d");

    let rows = 20;
    let cols = 10;
    let blockSize = 30;
    const width = cols * blockSize;
    const height = rows * blockSize;

    let blockSpeed = .25;
    let blockSpeedScale = 1;
    let blockSpeedIncrement = 0;
    let yPos = 0;
    let timeToLockConst = 10;
    let timeToLock = timeToLockConst;
    let canIncreaseSpeed = true;

    canvas.width = width + 250;
    canvas.height = height;

    const hudWidth = 200;
    const hudOffset = width + 50;
    const trueOffset = 50;
    const hudHeight = height;

    let downPressed = false;
    let score = 0;
    let level = 1;
    let linesCleared = 0;
    let rotations = 0;

    let grid = [];

    let state = typeOfGameMode;

    for (let i = 0; i < rows; i++) {
        grid.push([]);
        for (let j = 0; j < cols; j++) {
            grid[i].push(0)
        }
    }

    const random = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    let colors = ["#00f0f0", "#0000f0", "#f0a000", "#f0f000", "#00f000", "#a000f0", "#f00000"];

    let pieces = [  //I piece
        [[0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]],

        //J Piece
        [[2, 0, 0],
        [2, 2, 2],
        [0, 0, 0]],

        //L Piece
        [[0, 0, 3],
        [3, 3, 3],
        [0, 0, 0]],

        //O Piece
        [[4, 4],
        [4, 4]],

        //S Piece
        [[0, 5, 5],
        [5, 5, 0],
        [0, 0, 0]],

        //T Piece
        [[0, 6, 0],
        [6, 6, 6],
        [0, 0, 0]],

        //Z Piece
        [[7, 7, 0],
        [0, 7, 7],
        [0, 0, 0]]
    ];

    let bag7a = [];
    let bag7b = [];

    while (bag7a.length < pieces.length) {
        let pieceNum = random(0, pieces.length - 1);

        if (bag7a.indexOf(pieces[pieceNum]) === -1) {
            bag7a.push(pieces[pieceNum]);
        }
    }

    while (bag7b.length < pieces.length) {
        let pieceNum = random(0, pieces.length - 1);

        if (bag7b.indexOf(pieces[pieceNum]) === -1) {
            bag7b.push(pieces[pieceNum]);
        }
    }

    let currentPiece = [];

    let canHold = true;
    let pieceHolding = [];

    for (let i = 0; i < bag7a[0].length; i++) {
        currentPiece.push([]);

        for (let j = 0; j < bag7a[0][i].length; j++) {
            currentPiece[i].push(bag7a[0][i][j]);
        }
    }

    //currentPiece = pieces[0];

    let currentRow = 10;
    let currentCol = Math.round((cols - currentPiece.length) / 2);

    const resetBoard = () => {
        timeToLock = timeToLockConst;
        blockSpeed = 0.25;
        downPressed = false;
        score = 0;
        level = 1;
        time = 0;
        yPos = 0;
        linesCleared = 0;
        pieceHolding = [];
        rotations = 0;
        canHold = true;
        currentRow = 10;
        currentCol = Math.round((cols - currentPiece.length) / 2);

        grid.forEach((row, i, arr) => {
            arr[i].fill(0);
        });
    }

    const dropBoard = row => {
        for (let i = row; i >= 1; i--) {
            let tempRow = grid[i].slice();
            grid[i].fill(0);
            grid[i + 1] = tempRow;
        }

        linesCleared++;
    }

    const findState = () => {
        if (state === "Game Over") {
            grid.forEach(row => row.fill(0));
        }
    }

    const clearLine = () => {
        let totalLines = 0;

        grid.forEach((row, j) => {
            if (row.every(block => block !== 0)) {
                row.forEach((block, i, arr) => {
                    arr[i] = 0;
                });

                totalLines++;

                dropBoard(j - 1);
            }
        });

        if (totalLines === 1) {
            score += 100 * level;
        } else if (totalLines === 2) {
            score += 300 * level;
        } else if (totalLines === 3) {
            score += 600 * level;
        } else if (totalLines === 4) {
            score += 1000 * level;
        }

        level = Math.floor(linesCleared / 10) + 1;
    }

    const isValid = direction => {
        if (direction === "left") {
            let startingPosition = 0;

            let firstCol = [];

            for (let j = 0; j < currentPiece.length; j++) {
                firstCol.push(currentPiece[j][startingPosition]);
            }

            while (firstCol.every(block => block === 0)) {
                startingPosition++;
                firstCol = [];

                for (let j = 0; j < currentPiece.length; j++) {
                    firstCol.push(currentPiece[j][startingPosition]);
                }
            }

            return firstCol.every(block => block === 0 || (startingPosition + currentCol >= 0)) &&
                currentPiece.every((row, i, arr) => row.every((block, j) => {
                    let comparison = i + currentRow;

                    if (comparison >= grid.length) {
                        comparison--;
                    }

                    return block === 0 ||
                        (i + currentRow < grid.length &&
                            grid[i + currentRow] !== undefined &&
                            j + currentCol - 1 >= 0 &&
                            j + currentCol - 1 < grid[i + currentRow].length &&
                            grid[i + currentRow][j + currentCol - 1] === 0);
                }));

        } else if (direction === "right") {
            let endingPosition = currentPiece.length - 1;

            let lastCol = [];

            for (let j = 0; j < currentPiece.length; j++) {
                lastCol.push(currentPiece[j][endingPosition]);
            }

            while (lastCol.every(block => block === 0)) {
                endingPosition--;
                lastCol = [];

                for (let j = 0; j < currentPiece.length; j++) {
                    lastCol.push(currentPiece[j][endingPosition]);
                }
            }

            return lastCol.every(block => block === 0 || (endingPosition + currentCol < grid[0].length)) &&
                currentPiece.every((row, i, arr) => row.every((block, j) => {
                    return block === 0 ||
                        (j + currentCol + 1 < grid[0].length &&
                            i + currentRow < grid.length &&
                            grid[i + currentRow] !== undefined &&
                            j + currentCol + 1 < grid[i + currentRow].length &&
                            grid[i + currentRow][j + currentCol + 1] === 0);
                }));
        }

        let endingPosition = currentPiece.length - 1;

        let lastRow = currentPiece[endingPosition];

        while (lastRow.every(block => block === 0)) {
            endingPosition--;
            lastRow = currentPiece[endingPosition];
        }

        return lastRow.every(block => block === 0 || currentRow + endingPosition < grid.length) &&
            currentPiece.every((row, i) => row.every((block, j) => block === 0 ||
                (i + currentRow + 1 < grid.length &&
                    grid[i + currentRow + 1] !== undefined &&
                    j + currentCol < grid[i + currentRow + 1].length &&
                    grid[i + currentRow + 1][j + currentCol] === 0)));
    }

    const translatePiece = (col, row) => {
        currentRow += row;
        yPos += blockSize * row;
        currentCol += col;
    }

    const rotatePiece = direction => {
        let copyPiece = [];

        for (let i = 0; i < currentPiece.length; i++) {
            copyPiece.push([]);

            for (let j = 0; j < currentPiece[i].length; j++) {
                copyPiece[i].push(currentPiece[i][j]);
            }
        }

        for (let i = 0; i < currentPiece.length; i++) {
            for (let j = 0; j < currentPiece[i].length; j++) {
                if (direction === "clockwise") {
                    currentPiece[i][j] = copyPiece[currentPiece.length - j - 1][i];
                } else {
                    currentPiece[i][j] = copyPiece[j][currentPiece[0].length - i - 1];
                }
            }
        }

        let sign = 1;

        if (direction === "clockwise") {
            rotations++;
        } else {
            rotations--;
            sign = -1;
        }

        if (rotations < 0) {
            rotations = 3;
        }

        let startRow = 0;
        let endRow = currentPiece.length - 1;
        let startCol = 0;
        let endCol = currentPiece[0].length - 1;

        while (currentPiece[startRow].every(block => block === 0)) {
            startRow++;
        }

        while (currentPiece[endRow].every(block => block === 0)) {
            endRow--;
        }

        // eslint-disable-next-line no-loop-func
        while (currentPiece.every((row, i) => currentPiece[i][startCol] === 0)) {
            startCol++;
        }

        // eslint-disable-next-line no-loop-func
        while (currentPiece.every((row, i) => currentPiece[i][endCol] === 0)) {
            endCol--;
        }

        let wallKickCondition = currentRow + endRow > grid.length - 1 || currentCol + startCol < 0 || currentCol + endCol > grid[0].length - 1;

        for (let i = 0; i < currentPiece.length; i++) {
            for (let j = 0; j < currentPiece[i].length; j++) {
                if (currentPiece[i][j] !== 0) {
                    try {
                        if (!wallKickCondition && grid[i + currentRow][j + currentCol] !== 0) {
                            wallKickCondition = true;
                        }
                    } catch (e) {

                    }
                }
            }
        }

        let wallKickCase = 1;

        let translateX = 0;
        let translateY = 0;

        while (wallKickCondition && wallKickCase < 5) {
            if (currentPiece.length < 4) {
                if (rotations % 4 === 0) {
                    if (direction === "clockwise") {
                        if (wallKickCase === 1) {
                            translateX = -1;
                        } else if (wallKickCase === 2) {
                            translateX = -1;
                            translateY = 1;
                        } else if (wallKickCase === 3) {
                            translateY = -2;
                        } else {
                            translateX = -1;
                            translateY = -2;
                        }
                    } else {
                        if (wallKickCase === 1) {
                            translateX = 1;
                        } else if (wallKickCase === 2) {
                            translateX = 1;
                            translateY = 1;
                        } else if (wallKickCase === 3) {
                            translateY = -2;
                        } else {
                            translateX = 1;
                            translateY = -2;
                        }
                    }
                } else if (rotations % 4 === 1) {
                    if (wallKickCase === 1) {
                        translateX = -1;
                    } else if (wallKickCase === 2) {
                        translateX = -1;
                        translateY = -1;
                    } else if (wallKickCase === 3) {
                        translateY = 2;
                    } else {
                        translateX = -1;
                        translateY = 2;
                    }
                } else if (rotations % 4 === 2) {
                    if (direction === "clockwise") {
                        if (wallKickCase === 1) {
                            translateX = 1;
                        } else if (wallKickCase === 2) {
                            translateX = 1;
                            translateY = 1;
                        } else if (wallKickCase === 3) {
                            translateY = -2;
                        } else {
                            translateX = 1;
                            translateY = -2;
                        }
                    } else {
                        if (wallKickCase === 1) {
                            translateX = -1;
                        } else if (wallKickCase === 2) {
                            translateX = -1;
                            translateY = 1;
                        } else if (wallKickCase === 3) {
                            translateY = -2;
                        } else {
                            translateX = -1;
                            translateY = -2;
                        }
                    }
                } else {
                    if (wallKickCase === 1) {
                        translateX = 1;
                    } else if (wallKickCase === 2) {
                        translateX = 1;
                        translateY = -1;
                    } else if (wallKickCase === 3) {
                        translateY = 2;
                    } else {
                        translateX = 1;
                        translateY = 2;
                    }
                }
            } else {
                if (rotations % 4 === 0) {
                    if (wallKickCase === 1) {
                        if (direction === "clockwise") {
                            translateX = 1;
                        } else {
                            translateX = 2;
                        }
                    } else if (wallKickCase === 2) {
                        if (direction === "clockwise") {
                            translateX = -2;
                        } else {
                            translateX = -1;
                        }
                    } else if (wallKickCase === 3) {
                        if (direction === "clockwise") {
                            translateX = 1;
                            translateY = 2;
                        } else {
                            translateX = 2;
                            translateY = -1;
                        }
                    } else {
                        if (direction === "clockwise") {
                            translateX = -2;
                            translateY = -1;
                        } else {
                            translateX = -1;
                            translateY = 2;
                        }
                    }
                } else if (rotations % 4 === 1) {
                    if (wallKickCase === 1) {
                        if (direction === "clockwise") {
                            translateX = -2;
                        } else {
                            translateX = 1;
                        }
                    } else if (wallKickCase === 2) {
                        if (direction === "clockwise") {
                            translateX = 1;
                        } else {
                            translateX = -2;
                        }
                    } else if (wallKickCase === 3) {
                        if (direction === "clockwise") {
                            translateX = -2;
                            translateY = 1;
                        } else {
                            translateX = 1;
                            translateY = 2;
                        }
                    } else {
                        if (direction === "clockwise") {
                            translateX = 1;
                            translateY = -2;
                        } else {
                            translateX = -2;
                            translateY = -1;
                        }
                    }
                } else if (rotations % 4 === 2) {
                    if (wallKickCase === 1) {
                        if (direction === "clockwise") {
                            translateX = -1;
                        } else {
                            translateX = -2;
                        }
                    } else if (wallKickCase === 2) {
                        if (direction === "clockwise") {
                            translateX = 2;
                        } else {
                            translateX = 1;
                        }
                    } else if (wallKickCase === 3) {
                        if (direction === "clockwise") {
                            translateX = -1;
                            translateY = -2;
                        } else {
                            translateX = -2;
                            translateY = 1;
                        }
                    } else {
                        if (direction === "clockwise") {
                            translateX = 2;
                            translateY = 1;
                        } else {
                            translateX = 1;
                            translateY = -2;
                        }
                    }
                } else {
                    if (wallKickCase === 1) {
                        if (direction === "clockwise") {
                            translateX = 2;
                        } else {
                            translateX = -1;
                        }
                    } else if (wallKickCase === 2) {
                        if (direction === "clockwise") {
                            translateX = -1;
                        } else {
                            translateX = 2;
                        }
                    } else if (wallKickCase === 3) {
                        if (direction === "clockwise") {
                            translateX = 2;
                            translateY = -1;
                        } else {
                            translateX = -1;
                            translateY = -2;
                        }
                    } else {
                        if (direction === "clockwise") {
                            translateX = -1;
                            translateY = 2;
                        } else {
                            translateX = 2;
                            translateY = 1;
                        }
                    }
                }
            }

            translatePiece(translateX, translateY);

            wallKickCondition = currentRow + endRow > grid.length - 1 || currentCol + startCol < 0 || currentCol + endCol > grid[0].length - 1;

            for (let i = 0; i < currentPiece.length; i++) {
                for (let j = 0; j < currentPiece[i].length; j++) {
                    if (currentPiece[i][j] !== 0) {
                        try {
                            if (!wallKickCondition && grid[i + currentRow][j + currentCol] !== 0) {
                                wallKickCondition = true;
                            }
                        } catch (e) {

                        }
                    }
                }
            }

            if (wallKickCondition) {
                wallKickCase++;
                translatePiece(-translateX, -translateY);
                translateX = 0;
                translateY = 0;
            }
        }

        if (wallKickCase > 4) {
            currentPiece = copyPiece;
            rotations -= sign;
        }
    }

    const nextPiece = () => {
        rotations = 0;

        currentPiece = [];
        bag7a.shift();

        if (bag7a.length === 0) {
            bag7a = bag7b;
            bag7b = [];

            while (bag7b.length < pieces.length) {
                let pieceNum = random(0, pieces.length - 1);

                if (bag7b.indexOf(pieces[pieceNum]) === -1) {
                    bag7b.push(pieces[pieceNum]);
                }
            }
        }

        for (let i = 0; i < bag7a[0].length; i++) {
            currentPiece.push([]);

            for (let j = 0; j < bag7a[0][i].length; j++) {
                currentPiece[i].push(bag7a[0][i][j]);
            }
        }

        yPos = 0;

        currentRow = Math.floor(yPos / blockSize);

        currentCol = Math.round((cols - currentPiece.length) / 2);
    }

    const findGhost = drop => {
        let startingPosition = 0;

        while (currentPiece[startingPosition].every(block => block === 0)) {
            startingPosition++;
        }

        let endingPosition = currentPiece.length - 1;

        let lastRow = currentPiece[endingPosition];

        while (lastRow.every(block => block === 0)) {
            endingPosition--;
            lastRow = currentPiece[endingPosition];
        }

        let lastPosition = currentRow;

        let collision = false;

        while (!collision) {
            let validPieces = 0;

            for (let i = lastPosition; i < lastPosition + currentPiece.length; i++) {
                if (currentPiece[i - lastPosition].every(block => block === 0)) {
                    continue;
                }

                for (let j = currentCol; j < currentCol + currentPiece[0].length; j++) {
                    try {
                        if (i < grid.length && currentPiece[i - lastPosition][j - currentCol] !== 0 && grid[i][j] === 0) {
                            validPieces++;
                        }
                    } catch (error) {
                        //state = "Game Over";
                        //resetBoard();
                    }
                }
            }

            if (validPieces === 4) {
                lastPosition++;
            } else {
                collision = true;
            }
        }

        lastPosition += startingPosition - 1;

        //console.log(lastPosition, startingPosition);

        for (let i = 0; i < currentPiece.length; i++) {
            for (let j = 0; j < currentPiece[i].length; j++) {
                if (currentPiece[i][j] !== 0) {
                    graphics.globalAlpha = 0.5;
                    graphics.fillStyle = colors[currentPiece[i][j] - 1];
                    graphics.fillRect((j + currentCol) * blockSize, (lastPosition + i - startingPosition) * blockSize, blockSize, blockSize);
                    graphics.globalAlpha = 1;
                }
            }
        }

        if (drop) {
            for (let i = 0; i < currentPiece.length; i++) {
                for (let j = 0; j < currentPiece[i].length; j++) {
                    if (currentPiece[i][j] !== 0) {
                        //console.log((lastPosition+i-startingPosition))
                        try {
                            grid[lastPosition + i - startingPosition][currentCol + j] = currentPiece[i][j];
                        } catch (err) {

                        }
                    }
                }
            }

            timeToLock = timeToLockConst;

            nextPiece();

            score += level * 30;

            canHold = true;
        }
    }

    const updatePiece = (increment) => {
        findGhost(false);

        if (canIncreaseSpeed) {
            blockSpeedIncrement = level;
            blockSpeedScale = 1 + blockSpeedIncrement;
        }

        if (isValid("vertical")) {
            yPos += increment;
            currentRow = Math.floor(yPos / blockSize);

            if (downPressed && increment > blockSpeed) {
                score += level;
            }
        } else {
            for (let i = 0; i < currentPiece.length; i++) {
                for (let j = 0; j < currentPiece[i].length; j++) {
                    if (currentPiece[i][j] !== 0) {
                        try {
                            if (i + currentRow >= 0 && grid[i + currentRow][j + currentCol] !== 0) {
                                //transition = true;

                                resetBoard();
                            }
                        } catch (e) {

                        }
                    }
                }
            }

            if (timeToLock > 0) {
                timeToLock--;

                if (downPressed && increment > blockSpeed) {
                    timeToLock = 0;
                }
            } else {
                timeToLock = timeToLockConst;

                for (let i = 0; i < currentPiece.length; i++) {
                    for (let j = 0; j < currentPiece[i].length; j++) {
                        if (currentPiece[i][j] !== 0) {
                            try {
                                grid[i + currentRow][j + currentCol] = currentPiece[i][j];
                            } catch (e) {

                            }
                        }
                    }
                }

                nextPiece();

                score += level * 3;

                canHold = true;
            }
        }
    }

    const drawPiece = () => {
        let happened = false;

        for (let i = 0; i < currentPiece.length; i++) {
            if (happened) {
                break;
            }

            for (let j = 0; j < currentPiece[i].length; j++) {
                if (happened) {
                    break;
                }

                if (currentPiece[i][j] !== 0) {
                    graphics.fillStyle = colors[currentPiece[i][j] - 1];
                    happened = true;
                    break;
                }
            }
        }

        for (let i = 0; i < currentPiece.length; i++) {
            for (let j = 0; j < currentPiece[i].length; j++) {
                if (currentPiece[i][j] !== 0) {
                    graphics.fillRect((j + currentCol) * blockSize, (i + currentRow) * blockSize, blockSize, blockSize);
                    //graphics.fillRect((j+currentCol)*blockSize, Math.floor(yPos+(i*blockSize)), blockSize, blockSize);
                }
            }
        }
    }

    const drawGrid = () => {
        graphics.strokeStyle = "white";

        for (let i = 1; i < rows; i++) {
            graphics.beginPath();
            graphics.moveTo(0, i * blockSize);
            graphics.lineTo(width, i * blockSize);
            graphics.stroke();
        }

        for (let i = 1; i < cols; i++) {
            graphics.beginPath();
            graphics.moveTo(i * blockSize, 0);
            graphics.lineTo(i * blockSize, height);
            graphics.stroke();
        }

        if (!invisible) {
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    if (grid[i][j] !== 0) {
                        graphics.fillStyle = colors[grid[i][j] - 1];
                        graphics.fillRect(j * blockSize, i * blockSize, blockSize, blockSize);
                    }
                }
            }
        }
    }

    let showTimer = false;
    let time = 0;

    const updateHud = () => {
        graphics.fillStyle = "white";
        graphics.font = "20px Helvetica";
        graphics.textAlign = "center";

        graphics.fillText(`Score: ${score}`, hudOffset - (trueOffset / 2) + hudWidth / 2, 40);
        graphics.fillText(`Lines: ${linesCleared}`, hudOffset - (trueOffset / 2) + hudWidth / 2, 100);

        graphics.fillStyle = "red";
        graphics.fillText("Next", hudOffset - (trueOffset / 2) + hudWidth / 2, 130);

        let shiftY = 0;

        let newBlockSize = blockSize / 1.5;

        for (let i = 1; i < bag7a.length; i++) {
            if (i < 5) {
                let startingPosition = 0
                let endingPosition = bag7a[i].length - 1;

                for (let j = 0; j < bag7a[i].length; j++) {
                    for (let k = 0; k < bag7a[i][j].length; k++) {
                        if (bag7a[i][j][k] !== 0) {
                            graphics.fillStyle = colors[bag7a[i][j][k] - 1];

                            while (bag7a[i][startingPosition].every(block => block === 0)) {
                                startingPosition++;
                            }

                            while (bag7a[i][endingPosition].every(block => block === 0)) {
                                endingPosition--;
                            }

                            let yAlign = 130 - startingPosition * newBlockSize;

                            graphics.fillRect(hudOffset + Math.floor(k * newBlockSize + width / 2 - newBlockSize * bag7a[i][0].length / 2) - 75, Math.floor((j + shiftY) * newBlockSize + yAlign + newBlockSize * i), newBlockSize, newBlockSize);
                        }
                    }
                }

                shiftY += endingPosition - startingPosition + 1;
            }
        }

        if (bag7a.length < 5) {
            let piecesLeft = 5 - bag7a.length;

            for (let i = 0; i < piecesLeft; i++) {
                let startingPosition = 0
                let endingPosition = bag7b[i].length - 1;

                for (let j = 0; j < bag7b[i].length; j++) {
                    for (let k = 0; k < bag7b[i][j].length; k++) {
                        if (bag7b[i][j][k] !== 0) {
                            graphics.fillStyle = colors[bag7b[i][j][k] - 1];

                            startingPosition = 0;

                            while (bag7b[i][startingPosition].every(block => block === 0)) {
                                startingPosition++;
                            }

                            endingPosition = bag7b[i].length - 1;

                            while (bag7b[i][endingPosition].every(block => block === 0)) {
                                endingPosition--;
                            }

                            let yAlign = 130 - startingPosition * newBlockSize;

                            graphics.fillRect(hudOffset + Math.floor(k * newBlockSize + width / 2 - newBlockSize * bag7b[i][0].length / 2) - 75, Math.floor((j + shiftY) * newBlockSize + yAlign + newBlockSize * (i + bag7a.length)), newBlockSize, newBlockSize);
                        }
                    }
                }

                shiftY += endingPosition - startingPosition + 1;
            }
        }

        graphics.fillStyle = "white";
        graphics.fillText(`Hold`, hudOffset - (trueOffset / 2) + hudWidth / 2, 580);

        graphics.strokeStyle = "white";
        graphics.strokeRect(hudOffset, hudHeight - 200, 150, 150);

        for (let i = 0; i < pieceHolding.length; i++) {
            for (let j = 0; j < pieceHolding[i].length; j++) {
                if (pieceHolding[i][j] !== 0) {
                    graphics.fillStyle = colors[pieceHolding[i][j] - 1];

                    let startingPosition = 0;

                    while (pieceHolding[startingPosition].every(block => block === 0)) {
                        startingPosition++;
                    }

                    let endingPosition = pieceHolding.length - 1;

                    while (pieceHolding[endingPosition].every(block => block === 0)) {
                        endingPosition--;
                    }

                    let yAlign = hudHeight - 200 - startingPosition * blockSize;

                    let newAlign = 150 - blockSize * (endingPosition - startingPosition + 1);

                    graphics.fillRect(hudOffset + Math.floor(j * blockSize + width / 2 - blockSize * pieceHolding[0].length / 2) - 75, Math.floor(i * blockSize + yAlign + newAlign / 2), blockSize, blockSize);
                }
            }
        }

        if (showTimer) {
            graphics.fillStyle = "white";

            let minutes = `0${Math.floor(time / 3600) % 3600}`.slice(-2);
            let seconds = `0${Math.floor(time / 60) % 60}`.slice(-2);
            let milliseconds = `0${((time / 60) % 1).toString().substring(2, 4)}`.slice(-2);

            graphics.fillText(`Time: ${minutes}:${seconds}.${milliseconds}`, hudOffset - (trueOffset / 2) + hudWidth / 2, height / 1.55);
        }
    }

    let invisible = false;

    //let games = ["Sprint", "Fast"];

    const gameLogic = () => {
        showTimer = false;
        canIncreaseSpeed = true;

        let canAuthenticate = false;

        if (state === "Marathon" && linesCleared >= 2) {
            transition = true;
            state = "Game Complete";
            canAuthenticate = true;
        } else if (state === "Sprint") {
            showTimer = true;
            canIncreaseSpeed = false;

            time++;

            if (time / 60 > 30) {
                resetBoard();
            }

            if (linesCleared >= 2) {
                transition = true;
                state = "Game Complete";
                canAuthenticate = true;
            }
        } else if (state === "Invisible") {
            invisible = true;

            if (linesCleared >= 2) {
                state = "Game Completed";
                canAuthenticate = true;
            }
        } else if (state === "Master") {
            if (linesCleared >= 2) {
                state = "Game Completed";
                canAuthenticate = true;
            }
        } else if (state === "Fast") {
            blockSpeed += 0.005;

            if (linesCleared >= 2) {
                state = "Game Completed";
                canAuthenticate = true;
            }
        }

        if (canAuthenticate) {
            setIsAbleToAuthenticate(true);
            return;
        }

        if (!showTimer) {
            time = 0;
        }
    }

    let transition = false;

    //let games = ["Endless", "Marathon", "Sprint", "Invisible", "Master"];//, "Big", "ColorBlind", "Battle", ];
    let games = ["Master", "Invisible", "Sprint", "Fast", "Marathon"];//, "Big", "ColorBlind", "Battle", ];

    const draw = (increment, score) => {
        graphics.clearRect(0, 0, width + 50 + hudWidth, height);

        findState();
        gameLogic();

        if (isAbleToAuthenticate) {
            return;
        }

        if (games.includes(state)) {
            if (!transition) {
                clearLine();

                if (increment !== 0) {
                    updatePiece(increment);
                }

                drawPiece();
            }

            drawGrid();

            updateHud();
        }
    }

    const update = () => {
        try {
            draw(blockSpeed * blockSpeedScale);
        } catch (e) {

        }

        if (isAbleToAuthenticate) {
            return;
        }

        //draw(blockSize);

        requestAnimationFrame(update);
    }

    update();

    /*document.addEventListener("keydown", e => {
        e.preventDefault();
        if (games.includes(state)) {
            let moved = 0;

            if (e.key === "ArrowDown") {
                moved = blockSize;
                //blockSpeedScale = blockSize;
                downPressed = true;
            } else if (e.key === "ArrowLeft" && isValid("left")) {
                currentCol--;
            } else if (e.key === "ArrowRight" && isValid("right")) {
                currentCol++;
            } else if (e.key === "ArrowUp") {
                try {
                    rotatePiece("clockwise");
                } catch (error) {
                    //resetBoard();
                }
            } else if (e.key === "x") {
                try {
                    rotatePiece("counter-clockwise");
                } catch (error) {
                    //resetBoard();
                }
            } else if (e.key === "Shift") {
                if (canHold) {
                    canHold = false;

                    let piece = 0;

                    for (let i = 0; i < currentPiece.length; i++) {
                        for (let j = 0; j < currentPiece[i].length; j++) {
                            if (currentPiece[i][j] !== 0) {
                                try {
                                    piece = currentPiece[i][j];
                                } catch (e) {

                                }
                            }
                        }
                    }

                    if (pieceHolding.length !== 0) {
                        currentPiece = pieceHolding;

                        currentRow = 0;
                        yPos = 0;

                        currentCol = Math.round((cols - currentPiece.length) / 2);
                    } else {
                        nextPiece();
                    }

                    pieceHolding = [];

                    for (let i = 0; i < pieces[piece - 1].length; i++) {
                        pieceHolding.push([]);
                        for (let j = 0; j < pieces[piece - 1][i].length; j++) {
                            pieceHolding[i].push(pieces[piece - 1][i][j]);
                        }
                    }
                }
            } else if (e.key === "z") {
                findGhost(true);
            }

            if (["z", "x", "Shift", "ArrowLeft", "ArrowUp", "ArrowUp", "ArrowUp"].includes(e.key)) {
                draw(moved);
            }
        }
    });

    document.addEventListener("keyup", e => {
        e.preventDefault();
        if (games.includes(state)) {
            if (e.key === "ArrowDown") {
                downPressed = false;
            }
        }
    });*/

    document.addEventListener("keydown", (e) => {
        const tag = e.target.tagName;

        // allow typing in inputs, textareas, and contentEditable
        if (tag === "INPUT" || tag === "TEXTAREA" || e.target.isContentEditable) {
            return;
        }

        // block scrolling for arrow keys and space
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
            e.preventDefault();
        }

        if (!games.includes(state)) return;

        let moved = 0;

        if (e.key === "ArrowDown") {
            moved = blockSize;
            downPressed = true;
        } else if (e.key === "ArrowLeft" && isValid("left")) {
            currentCol--;
        } else if (e.key === "ArrowRight" && isValid("right")) {
            currentCol++;
        } else if (e.key === "ArrowUp") {
            rotatePiece("clockwise");
        } else if (e.key === "x") {
            rotatePiece("counter-clockwise");
        } else if (e.key === "Shift") {
            if (canHold) {
                canHold = false;

                let piece = 0;

                for (let i = 0; i < currentPiece.length; i++) {
                    for (let j = 0; j < currentPiece[i].length; j++) {
                        if (currentPiece[i][j] !== 0) {
                            try {
                                piece = currentPiece[i][j];
                            } catch (e) {

                            }
                        }
                    }
                }

                if (pieceHolding.length !== 0) {
                    currentPiece = pieceHolding;

                    currentRow = 0;
                    yPos = 0;

                    currentCol = Math.round((cols - currentPiece.length) / 2);
                } else {
                    nextPiece();
                }

                pieceHolding = [];

                for (let i = 0; i < pieces[piece - 1].length; i++) {
                    pieceHolding.push([]);
                    for (let j = 0; j < pieces[piece - 1][i].length; j++) {
                        pieceHolding[i].push(pieces[piece - 1][i][j]);
                    }
                }
            }
        } else if (e.key === "z") {
            findGhost(true);
        }

        if (["z", "x", "Shift", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(e.key)) {
            draw(moved);
        }
    });

    document.addEventListener("keyup", (e) => {
        const tag = e.target.tagName;

        if (tag === "INPUT" || tag === "TEXTAREA" || e.target.isContentEditable) {
            return;
        }

        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
            e.preventDefault();
        }

        if (!games.includes(state)) return;

        if (e.key === "ArrowDown") {
            downPressed = false;
        }
    });

}