import {Controller} from "./logic/controller.js";
import {Tetromino} from "./logic/tetromino.js";
import {Printer} from "./view/printer.js";
import {Updater} from "./view/updater.js";
import {Rules} from "./logic/rules.js";
import {Sound} from "./view/sounds.js";

const GRID = 32;
const WIDTH = 10;
const HEIGHT = 20;
const MAX_LEADERS = 10;

let info = {
    level: 0,
    score: 0,
    username: new URLSearchParams(document.location.search).get("username") ? new URLSearchParams(document.location.search).get("username") : localStorage.getItem('name'),
    leaderboard: JSON.parse(localStorage.getItem('leaders'))
};
let gameOver = false;
let playfield = [];
let tetromino, nextTetromino;
for (let row = -3; row < HEIGHT; ++row) {
    playfield[row] = [];
    for (let col = 0; col < WIDTH; ++col) {
        playfield[row][col] = 0;
    }
}


const leaveButton = document.getElementById("login");

const sound = new Sound();
const rules = new Rules(info);
const tetrominoGen = new Tetromino();
const controller = new Controller(playfield, tetrominoGen);
const printer = new Printer(document.getElementById("game-field"), document.getElementById("next-figure"), playfield, GRID, HEIGHT, WIDTH);
const updater = new Updater(info, document.getElementById("username"), document.getElementById("level"), document.getElementById("score"), document.getElementById("leaderboard"), MAX_LEADERS);


function initTetromino() {
    tetromino = nextTetromino ? nextTetromino : tetrominoGen.getNextTetromino(WIDTH);
    nextTetromino = tetrominoGen.getNextTetromino(WIDTH);
    printer.fillNextFigure(nextTetromino);
}

function endGame() {
    gameOver = true;
    sound.gameOver();
    updater.updateLeaders();
    updater.updateInfo();
    printer.printGameOver();

    setInterval(() => {
        if (leaveButton.style.backgroundColor === 'coral')
            leaveButton.style.backgroundColor = 'darkorange';
        else
            leaveButton.style.backgroundColor = 'coral';
    }, 500);
}

function step() {
    if (!tetromino)
        initTetromino();

    if (!controller.moveDown(tetromino)) {
        let res = controller.placeTetromino(tetromino);
        if (res === -1) {
            endGame();
        } else {
            if (res !== 0)
                sound.clearStripe();
            rules.addStripes(res);
            updater.updateInfo();
            initTetromino();
        }
    }
}

leaveButton.addEventListener('click', () => {
    if (!gameOver)
        updater.updateLeaders();
});
document.addEventListener('keydown', event => {
    if (gameOver)
        return;

    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        controller.moveGor(tetromino, event.key === 'ArrowLeft' ? -1 : 1);
    } else if (event.key === 'ArrowUp') {
        controller.rotate(tetromino);
    } else if (event.key === 'ArrowDown' || event.key === ' ') {
        step();
    }

    if (!gameOver)
        printer.printField(tetromino);
})

setTimeout(function tick() {
    if (gameOver)
        return;
    step();
    if (gameOver)
        return;
    printer.printField(tetromino);
    setTimeout(tick, rules.calcTick());
}, rules.calcTick());
