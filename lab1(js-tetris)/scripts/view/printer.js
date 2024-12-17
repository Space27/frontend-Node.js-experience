class Printer {
    constructor(gameField, nextFigure, playfield, grid, height, width) {
        this.gameField = gameField;
        this.nextFigure = nextFigure;
        this.canField = gameField.getContext('2d');
        this.canFigure = nextFigure.getContext('2d');
        this.grid = grid;
        this.playfield = playfield;
        this.width = width;
        this.height = height;
    }

    fillNextFigure(tetromino) {
        this.canFigure.clearRect(0, 0, this.nextFigure.width, this.nextFigure.height);
        this.canFigure.fillStyle = tetromino.color;
        const diffX = (4 - tetromino.matrix.length) / 2;
        const diffY = Math.ceil(diffX);
        for (let row = 0; row < tetromino.matrix.length; ++row) {
            for (let col = 0; col < tetromino.matrix[row].length; ++col) {
                if (tetromino.matrix[row][col]) {
                    this.canFigure.fillRect((col + diffX) * this.grid, (row + diffY) * this.grid, this.grid - 1, this.grid - 1);
                }
            }
        }
    }

    printField(tetromino) {
        this.canField.clearRect(0, 0, this.gameField.width, this.gameField.height);

        for (let row = 0; row < this.height; ++row) {
            for (let col = 0; col < this.width; ++col) {
                if (this.playfield[row][col]) {
                    this.canField.fillStyle = this.playfield[row][col];
                    this.canField.fillRect(col * this.grid, row * this.grid, this.grid - 1, this.grid - 1);
                }
            }
        }

        this.canField.fillStyle = tetromino.color;
        for (let row = 0; row < tetromino.matrix.length; ++row) {
            for (let col = 0; col < tetromino.matrix[row].length; ++col) {
                if (tetromino.matrix[row][col]) {
                    this.canField.fillRect((tetromino.col + col) * this.grid, (tetromino.row + row) * this.grid, this.grid - 1, this.grid - 1);
                }
            }
        }
    }

    printGameOver() {
        this.canField.fillStyle = 'black';
        this.canField.globalAlpha = 0.75;
        this.canField.fillRect(0, this.gameField.height / 2 - this.grid * 2, this.gameField.width, this.grid * 4);
        this.canField.globalAlpha = 1;
        this.canField.fillStyle = 'white';
        this.canField.font = '30px "Press Start 2P"';
        this.canField.textAlign = 'center';
        this.canField.textBaseline = 'middle';
        this.canField.fillText('ПОТРАЧЕНО!', this.gameField.width / 2, this.gameField.height / 2);
    }
}

export {Printer};