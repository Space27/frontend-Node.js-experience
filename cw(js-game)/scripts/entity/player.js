import {Entity} from "./entity.js";
import {gameManager} from "../manager/gameManager.js";
import {physicManager} from "../manager/physicManager.js";
import {soundManager} from "../manager/soundManager.js";
import {Bullet} from "./bullet.js";

export class Player extends Entity {
    constructor() {
        super();
        this.name = 'Player';
        this.win = false;
        this.speed = 2;
        this.move_x = 0;
        this.move_y = 0;
        this.score = 0;
        this.life = 100;
        this.maxLife = 250;
        this.mana = 100;
        this.maxMana = 250;
        this.iteration = 0;
        this.iterDelay = 0;
        this.iterMaxDelay = Math.floor(FPS / 7);
        this.direction = 'right';
        this.shieldUp = false;
    }

    getSpriteName() {
        return `player_${this.direction}_${this.iteration}`;
    }

    update() {
        this.changeDirection();
        physicManager.update(this);
    }

    changeDirection() {
        if (this.direction === 'right' && this.move_x === 1 || this.direction === 'left' && this.move_x === -1
            || this.direction === 'up' && this.move_y === -1 || this.direction === 'down' && this.move_y === 1) {
            this.iterDelay = (this.iterDelay + 1) % this.iterMaxDelay;
            this.iteration = (this.iteration + (this.iterDelay === 0 ? 1 : 0)) % 3;
        } else {
            if (this.move_x === 1) {
                this.direction = 'right';
            } else if (this.move_x === -1) {
                this.direction = 'left';
            } else if (this.move_y === -1) {
                this.direction = 'up';
            } else if (this.move_y === 1) {
                this.direction = 'down';
            } else {
                return;
            }
            this.iteration = 0;
        }
    }

    onTouchEntity(obj) {
        if (obj.name.startsWith('Score')) {
            soundManager.play('../assets/sound/coin.mp3');
            this.score += 50;
            obj.kill();
        } else if (obj.name.startsWith('Health')) {
            soundManager.play('../assets/sound/potion.mp3');
            this.life = Math.min(this.life + 50, this.maxLife);
            obj.kill();
        } else if (obj.name.startsWith('Mana')) {
            soundManager.play('../assets/sound/potion.mp3');
            this.mana = Math.min(this.mana + 50, this.maxMana);
            obj.kill();
        } else if (obj.name.startsWith('Exit')) {
            this.win = true;
        }
    }

    kill() {
        this.life = Math.max(0, this.life - 50);
        if (this.life <= 0) {
            gameManager.kill(this);
        }
    }

    fire() {
        if (this.mana >= 25) {
            soundManager.play('../assets/sound/fireball.mp3');
            this.mana -= 25;

            let fireball = new Bullet(this.direction, 'fireball');
            fireball.name += (++gameManager.fireNum);

            switch (this.direction) {
                case 'left':
                    fireball.pos_x = this.pos_x - fireball.size_x;
                    fireball.pos_y = this.pos_y + this.size_y / 2 - fireball.size_y / 2;
                    break;
                case 'right':
                    fireball.pos_x = this.pos_x + this.size_x;
                    fireball.pos_y = this.pos_y + this.size_y / 2 - fireball.size_y / 2;
                    break;
                case 'up':
                    fireball.pos_x = this.pos_x + this.size_x / 2 - fireball.size_x / 2;
                    fireball.pos_y = this.pos_y - fireball.size_y;
                    break;
                case 'down':
                    fireball.pos_x = this.pos_x + this.size_x / 2 - fireball.size_x / 2;
                    fireball.pos_y = this.pos_y + this.size_y;
            }

            gameManager.addEntity(fireball);
        } else {
            soundManager.play('../assets/sound/empty.mp3');
        }
    }

    ult() {
        if (this.mana >= 100) {
            soundManager.play('../assets/sound/ult.mp3', {volume: 0.4});

            this.mana -= 100;
            let magnet = new Bullet(this.direction, 'magnet');
            magnet.name += (++gameManager.fireNum);

            switch (this.direction) {
                case 'left':
                    magnet.pos_x = this.pos_x - magnet.size_x;
                    magnet.pos_y = this.pos_y + this.size_y / 2 - magnet.size_y / 2;
                    break;
                case 'right':
                    magnet.pos_x = this.pos_x + this.size_x;
                    magnet.pos_y = this.pos_y + this.size_y / 2 - magnet.size_y / 2;
                    break;
                case 'up':
                    magnet.pos_x = this.pos_x + this.size_x / 2 - magnet.size_x / 2;
                    magnet.pos_y = this.pos_y - magnet.size_y;
                    break;
                case 'down':
                    magnet.pos_x = this.pos_x + this.size_x / 2 - magnet.size_x / 2;
                    magnet.pos_y = this.pos_y + this.size_y;
            }

            magnet.init();
            gameManager.addEntity(magnet);
        } else {
            soundManager.play('../assets/sound/empty.mp3');
        }
    }

    shield() {
        if (this.mana >= 50 && !this.shieldUp) {
            this.mana -= 50;

            this.shieldUp = true;

            setTimeout(() => this.shieldUp = false, 5000);
        } else if (!this.shieldUp) {
            soundManager.play('../assets/sound/empty.mp3');
        }
    }
}