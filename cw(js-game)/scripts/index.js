import {gameManager} from "./manager/gameManager.js";
import {storage} from "./storage.js";

const limitLeaderboard = 10;
const maxLevel = 2;

const healthField = document.getElementById('health');
const scoreField = document.getElementById('score');
const manaField = document.getElementById('mana');
const playerField = document.getElementById('username');
const shieldField = document.getElementById('shield');

const leaderboard = document.getElementById('leaderboard');
const leaderboardName = document.getElementById('leaderboard-title');

const homeButton = document.getElementById('home');

let level = Number(new URLSearchParams(location.search).get('level') ?? 2);
let username = new URLSearchParams(location.search).get('username') ?? localStorage.getItem('name') ?? 'name';

export function nextLevel() {
    saveResult();

    if (level < maxLevel) {
        const newParams = new URLSearchParams(location.search);
        newParams.set('level', (++level).toString());
        window.location = `${window.location.pathname}?${newParams}`;
    } else {
        printAboveCanvas('Best childhood... he thought');

        setTimeout(() => {
            if (confirm('Do you wanna go home?')) homeButton.click();
        }, 500);
    }
}

export function updateData(player) {
    playerField.textContent = `Player: ${username}`;
    healthField.textContent = `Health: ${player.life}`;
    manaField.textContent = `Mana: ${player.mana}`;
    scoreField.textContent = `Score: ${player.score}`;
    shieldField.textContent = `Shield: ${player.shieldUp ? 'up' : 'down'}`;
}

export function gameOver() {
    saveResult();

    printAboveCanvas('He was the one who wants to... magic');

    setTimeout(() => {
        if (confirm('Do you wanna to replay?')) location.reload();
    }, 500);
}

function printAboveCanvas(text) {
    ctx.fillStyle = 'black';
    ctx.globalAlpha = 0.75;
    ctx.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);
    ctx.globalAlpha = 1;
    ctx.font = '16px Dalelands';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
}

function startLevel() {
    ctx.clearRect(0, 0, ctx.width, ctx.height);

    gameManager.level = level;

    showResult();

    gameManager.loadAll(level);
    gameManager.play();
}

function showResult() {
    let records = storage.getAllRecords(level).slice(0, limitLeaderboard);

    leaderboardName.textContent = `Leaderboard: Level ${level}`;
    leaderboard.innerHTML = '';

    for (const record of records) {
        const newRecord = document.createElement('li');
        newRecord.textContent = `${record.player}: ${record.result}`;
        leaderboard.appendChild(newRecord);
    }
}

function saveResult() {
    storage.addResult(level, username, gameManager.player.score);
}

homeButton.addEventListener('click', () => saveResult());

startLevel();