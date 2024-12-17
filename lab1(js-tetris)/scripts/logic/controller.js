class Controller {
    constructor(playfield, tetrominoGen) {
        this.playfield = playfield;
        this.tetrominoGen = tetrominoGen;
    }

    isValidMove(matrix, cellRow, cellCol) {
        for (let row = 0; row < matrix.length; ++row) {
            for (let col = 0; col < matrix[row].length; ++col) {
                if (matrix[row][col] && (
                    cellCol + col < 0 ||
                    cellCol + col >= this.playfield[0].length ||
                    cellRow + row >= this.playfield.length ||
                    this.playfield[cellRow + row][cellCol + col])
                ) {
                    return false;
                }
            }
        }

        return true;
    }

    deleteStripes() {
        let deletedStripes = 0;

        for (let row = this.playfield.length - 1; row >= 0;) {
            if (this.playfield[row].every(cell => cell !== 0)) {
                ++deletedStripes;
                for (let r = row; r >= 0; --r) {
                    for (let c = 0; c < this.playfield[r].length; ++c) {
                        this.playfield[r][c] = this.playfield[r - 1][c];
                    }
                }
            } else {
                --row;
            }
        }

        return deletedStripes;
    }

    placeTetromino(tetromino) {
        for (let row = 0; row < tetromino.matrix.length; ++row) {
            for (let col = 0; col < tetromino.matrix[row].length; ++col) {
                if (tetromino.matrix[row][col]) {
                    if (tetromino.row + row < 0) {
                        return -1;
                    }
                    this.playfield[tetromino.row + row][tetromino.col + col] = tetromino.color;
                }
            }
        }

        return this.deleteStripes();
    }

    moveDown(tetromino) {
        if (!this.isValidMove(tetromino.matrix, tetromino.row + 1, tetromino.col)) {
            return false;
        } else {
            tetromino.row = tetromino.row + 1;
            return true;
        }
    }

    rotate(tetromino) {
        const matrix = this.tetrominoGen.rotateFigure(tetromino.matrix);
        if (this.isValidMove(matrix, tetromino.row, tetromino.col)) {
            tetromino.matrix = matrix;
        }
    }

    moveGor(tetromino, shift) {
        const col = tetromino.col + shift;

        if (this.isValidMove(tetromino.matrix, tetromino.row, col)) {
            tetromino.col = col;
        }
    }
}

export {Controller}