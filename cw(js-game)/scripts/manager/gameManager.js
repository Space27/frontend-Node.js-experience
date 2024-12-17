import {eventsManager} from "./eventsManager.js";
import {mapManager} from "./mapManager.js";
import {spriteManager} from "./spriteManager.js";
import {soundManager} from "./soundManager.js";
import {BonusHealth} from "../entity/bonusHealth.js";
import {BonusScore} from "../entity/bonusScore.js";
import {BonusMana} from "../entity/bonusMana.js";
import {Exit} from "../entity/exit.js";
import {Player} from "../entity/player.js";
import {Enemy} from "../entity/enemy.js";
import {Bullet} from "../entity/bullet.js";
import {gameOver, nextLevel, updateData} from "../index.js";

class GameManager {
    constructor() {
        this.factory = {};
        this.entities = [];
        this.fireNum = 0;
        this.player = null;
        this.laterKill = [];

        this.level = null;
        this.interval = null;
    }

    initPlayer(obj) {
        this.player = obj;
    }

    kill(obj) {
        this.laterKill.push(obj);
    }

    draw(ctx) {
        for (let entity of this.entities) {
            entity.draw(ctx);
        }
    }

    update() {
        if (this.player === null) {
            return;
        }

        this.player.move_x = 0;
        this.player.move_y = 0;

        if (eventsManager.action['up'])
            this.player.move_y = -1;
        if (eventsManager.action['down'])
            this.player.move_y = 1;
        if (eventsManager.action['left'])
            this.player.move_x = -1;
        if (eventsManager.action['right'])
            this.player.move_x = 1;
        if (eventsManager.action['shield']) {
            this.player.shield();
            eventsManager.action['shield'] = false;
        }
        if (eventsManager.action['fire']) {
            this.player.fire();
            eventsManager.action['fire'] = false;
        } else if (eventsManager.action['ult']) {
            this.player.ult();
            eventsManager.action['ult'] = false;
        }

        this.entities.forEach(e => {
            try {
                e.update();
            } catch (ex) {
            }
        });

        this.entities = this.entities.filter(e => !this.laterKill.includes(e));
        this.laterKill = [];

        mapManager.draw(ctx);
        this.draw(ctx);
        mapManager.drawAboveEntity(ctx);
        mapManager.centerAt(this.player.pos_x, this.player.pos_y);
        updateData(this.player);
        if (!this.entities.includes(this.player)) {
            this.loseLevel();
        } else if (this.player.win) {
            this.finishLevel();
        }
    }

    loadAll(level) {
        switch (level) {
            case 1:
                mapManager.loadMap('../../assets/map1.tmj');
                break;
            case 2:
                mapManager.loadMap('../../assets/map2.tmj');
        }

        spriteManager.loadAtlas({
            '../../assets/sprites/player.json': '../../assets/sprites/player.png',
            '../../assets/sprites/arrow.json': '../../assets/sprites/arrow.png',
            '../../assets/sprites/fireball.json': '../../assets/sprites/fireball.png',
            '../../assets/sprites/coin.json': '../../assets/sprites/coin.png',
            '../../assets/sprites/bonuses.json': '../../assets/sprites/bonuses.png',
            '../../assets/sprites/enemy.json': '../../assets/sprites/enemy.png',
            '../../assets/sprites/magnet.json': '../../assets/sprites/magnet.png'
        });

        gameManager.factory['Player'] = Player;
        gameManager.factory['Enemy'] = Enemy;

        gameManager.factory['Score'] = BonusScore;
        gameManager.factory['Health'] = BonusHealth;
        gameManager.factory['Mana'] = BonusMana;

        gameManager.factory['Bullet'] = Bullet;
        gameManager.factory['Exit'] = Exit;

        soundManager.loadArray(['../assets/sound/fireball.mp3', '../assets/sound/arrow.mp3', '../assets/sound/shield.mp3', '../assets/sound/ult.mp3', '../assets/sound/potion.mp3', '../assets/sound/coin.mp3', '../assets/sound/ambient.mp3', '../assets/sound/empty.mp3']);
        soundManager.play('../assets/sound/ambient.mp3', {looping: true});

        eventsManager.setup(canvas);

        mapManager.parseEntities();
        mapManager.draw(ctx);
        mapManager.drawAboveEntity(ctx);
    }

    play() {
        this.interval = setInterval(() => this.updateWorld(), GLOBAL_DELAY);
    }

    updateWorld() {
        this.update();
    }

    finishLevel() {
        soundManager.stopAll();
        clearInterval(this.interval);
        nextLevel();
    }

    loseLevel() {
        soundManager.stopAll();
        clearInterval(this.interval);
        gameOver();
    }

    addEntity(obj) {
        this.entities.push(obj);
    }

    findEntitiesByType(type) {
        return this.entities.filter(e => e.type === type);
    }
}

export const gameManager = new GameManager();