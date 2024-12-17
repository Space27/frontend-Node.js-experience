import {Entity} from "./entity.js";
import {physicManager} from "../manager/physicManager.js";
import {soundManager} from "../manager/soundManager.js";
import {gameManager} from "../manager/gameManager.js";
import {pathfinder} from "../pathfinder.js";
import {mapManager} from "../manager/mapManager.js";
import {Bullet} from "./bullet.js";

export class Enemy extends Entity {
    constructor() {
        super();
        this.name = 'Enemy';
        this.speed = 2;
        this.move_x = 0;
        this.move_y = 0;
        this.iteration = 0;
        this.iterDelay = 0;
        this.iterMaxDelay = Math.floor(FPS / 7);
        this.direction = 'right';
        this.path = null;
        this.isFire = false;
    }

    getSpriteName() {
        return `enemy_${this.direction}_${this.iteration}`;
    }

    update() {
        const cords = mapManager.getCord(this);
        const playerCords = mapManager.getCord(gameManager.player);

        if (gameManager.entities.includes(gameManager.player))
            this.path = pathfinder.findPath(mapManager.collision, ...cords, ...playerCords, {maxLen: 10});
        else
            this.path = null;

        if (this.path === null || this.path.length === 0) {
            this.move_x = 0;
            this.move_y = 0;
        } else {
            const [x, y] = mapManager.getCord(this);
            const step = this.path[0];
            this.move_x = Math.sign(step.x - x);
            this.move_y = Math.sign(step.y - y);
        }

        this.changeDirection();
        physicManager.update(this);

        if (this.path && (
            this.path.length === 0 ||
            (cords[0] === playerCords[0] || cords[1] === playerCords[1]) &&
            pathfinder.onLine(this.path, ...mapManager.getCord(gameManager.player), this))) {
            this.fire();
        }
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

    kill() {
        gameManager.kill(this);
        gameManager.player.score += 100;
    }

    fire() {
        if (!this.isFire) {
            this.isFire = true;
            const playerX = gameManager.player.pos_x;
            const playerY = gameManager.player.pos_y;

            if (Math.abs(this.pos_x - playerX) > Math.abs(this.pos_y - playerY)) {
                if (this.pos_x < playerX) {
                    this.direction = 'right';
                } else {
                    this.direction = 'left';
                }
            } else {
                if (this.pos_y < playerY) {
                    this.direction = 'down';
                } else {
                    this.direction = 'up';
                }
            }

            let arrow = new Bullet(this.direction, 'arrow');
            arrow.name += (++gameManager.fireNum);

            switch (this.direction) {
                case 'left':
                    arrow.pos_x = this.pos_x - arrow.size_x;
                    arrow.pos_y = Math.max(Math.min(this.pos_y + this.size_y / 2 - arrow.size_y / 2, playerY + gameManager.player.size_y), playerY - arrow.size_y + 1);
                    break;
                case 'right':
                    arrow.pos_x = this.pos_x + this.size_x;
                    arrow.pos_y = Math.max(Math.min(this.pos_y + this.size_y / 2 - arrow.size_y / 2, playerY + gameManager.player.size_y), playerY - arrow.size_y + 1);
                    break;
                case 'up':
                    arrow.pos_x = Math.max(Math.min(this.pos_x + this.size_x / 2 - arrow.size_x / 2, playerX + gameManager.player.size_x), playerX - arrow.size_x + 1);
                    arrow.pos_y = this.pos_y - arrow.size_y;
                    break;
                case 'down':
                    arrow.pos_x = Math.max(Math.min(this.pos_x + this.size_x / 2 - arrow.size_x / 2, playerX + gameManager.player.size_x), playerX - arrow.size_x + 1);
                    arrow.pos_y = this.pos_y + this.size_y;
            }

            gameManager.addEntity(arrow);
            soundManager.playWorldSound('../assets/sound/arrow.mp3', this.pos_x, this.pos_y);

            setTimeout(() => this.isFire = false, 2000);
        }
    }
}