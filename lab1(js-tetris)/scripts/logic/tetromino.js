class Tetromino {
    tetrominos = [
        [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [1, 0, 0],
            [1, 1, 1],
            [0, 0, 0],
        ],
        [
            [0, 0, 1],
            [1, 1, 1],
            [0, 0, 0],
        ],
        [
            [1, 1],
            [1, 1],
        ],
        [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0],
        ],
        [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0],
        ],
        [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0],
        ]
    ];

    colors = ['cyan', 'yellow', 'purple', 'green', 'red', 'blue', 'orange'];

    it = this.getRandomFigure();

    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; --i) {
            let j = this.getRandomInt(i + 1);
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    * getRandomFigure() {
        let bag = [];
        while (true) {
            if (bag.length === 0) {
                bag = [...Array(this.tetrominos.length)].map((_, i) => i);
                this.shuffle(bag);
            }
            yield this.tetrominos[bag.pop()];
        }
    }

    getRandomColor() {
        return this.colors[this.getRandomInt(this.colors.length)];
    }

    rotateFigure(tetromino) {
        return tetromino.map((row, i) =>
            row.map((val, j) => tetromino[tetromino.length - j - 1][i])
        );
    }

    getNextTetromino(width) {
        const matrix = this.it.next().value;
        const color = this.getRandomColor();

        const col = width / 2 - Math.ceil(matrix.length / 2);
        const row = -1 - (matrix.length + 1) % 2;

        return {
            matrix: matrix,
            color: color,
            row: row,
            col: col
        };
    }
}

export {Tetromino};