import {Entity} from "./entity.js";
import {physicManager} from "../manager/physicManager.js";
import {mapManager} from "../manager/mapManager.js";
import {gameManager} from "../manager/gameManager.js";
import {pathfinder} from "../pathfinder.js";
import {soundManager} from "../manager/soundManager.js";

export class Bullet extends Entity {
    constructor(direction, type) {
        super();
        switch (type) {
            case 'fireball':
                this.size_x = 21;
                this.size_y = 13;
                break;
            case 'arrow':
                this.size_x = 23;
                this.size_y = 8;
                break;
            case 'magnet':
                this.size_x = 24;
                this.size_y = 11;
        }
        this.name = 'Bullet';
        this.speed = 6;
        this.move_x = 0;
        this.move_y = 0;
        this.type = type;
        this.direction = direction;
        this.iteration = 0;
        this.iterDelay = 0;
        this.spriteSettings = {
            fireball: {maxDelay: Math.floor(FPS / 5), cycle: 4},
            arrow: {maxDelay: Math.floor(FPS / 5), cycle: 4},
            magnet: {maxDelay: Math.floor(FPS / 10), cycle: 9},
        }

        switch (this.direction) {
            case 'up':
                this.move_y = -1;
                [this.size_x, this.size_y] = [this.size_y, this.size_x];
                break;
            case 'down':
                this.move_y = 1;
                [this.size_x, this.size_y] = [this.size_y, this.size_x];
                break;
            case 'right':
                this.move_x = 1;
                break;
            case 'left':
                this.move_x = -1;
                break;
        }
    }

    init() {
        if (this.type === 'magnet') {
            this.initMagnet();
            setTimeout(() => this.kill(), 3000);
        }
    }

    getSpriteName() {
        return `${this.type}_${this.direction}_${this.iteration}`;
    }

    update() {
        if (this.type !== 'magnet') {
            this.iterDelay = (this.iterDelay + 1) % this.spriteSettings[this.type].maxDelay;
            this.iteration = (this.iteration + (this.iterDelay === 0 ? 1 : 0)) % this.spriteSettings[this.type].cycle;
        } else {
            this.magnetUpdate();
        }
        physicManager.update(this);
    }

    onTouchEntity(obj) {
        if (obj.name.startsWith('Enemy') && (this.type === 'fireball' || this.type === 'magnet') || obj.name.startsWith('Bullet')) {
            obj.kill();
            this.kill();
        } else if (obj.name.startsWith('Player') && this.type === 'arrow') {
            if (!obj.shieldUp)
                obj.kill();
            else
                soundManager.play('../assets/sound/shield.mp3');
            this.kill();
        }
    }

    onTouchMap() {
        this.kill();
    }

    magnetUpdate() {
        if (this.targetEnemy === null) {
            return;
        } else if (!gameManager.entities.includes(this.targetEnemy)) {
            this.initMagnet();
        }

        this.path = pathfinder.findPath(mapManager.collision, ...mapManager.getCord(this), ...mapManager.getCord(this.targetEnemy), {maxLen: 20});

        if (this.path && this.path.length === 0) {
            this.move_x = Math.sign(this.targetEnemy.pos_x - this.pos_x);
            this.move_y = Math.sign(this.targetEnemy.pos_y - this.pos_y);
        } else if (this.path) {
            const [x, y] = mapManager.getCord(this);
            const step = this.path[0];
            this.move_x = Math.sign(step.x - x);
            this.move_y = Math.sign(step.y - y);
        }

        this.changeDirection();
    }

    changeDirection() {
        if (this.direction === 'right' && this.move_x === 1 || this.direction === 'left' && this.move_x === -1
            || this.direction === 'up' && this.move_y === -1 || this.direction === 'down' && this.move_y === 1) {
            this.iterDelay = (this.iterDelay + 1) % this.spriteSettings[this.type].maxDelay;
            this.iteration = (this.iteration + (this.iterDelay === 0 ? 1 : 0)) % this.spriteSettings[this.type].cycle;
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

    initMagnet() {
        const enemies = gameManager.findEntitiesByType('Enemy');
        const cords = mapManager.getCord(this);
        this.targetEnemy = null;

        if (enemies === null || enemies.length < 1) {
            return false;
        } else {
            let minDist = Infinity;

            for (const enemy of enemies) {
                const enemyCord = mapManager.getCord(enemy);
                if (Math.abs(enemyCord[0] - cords[0]) + Math.abs(enemyCord[1] - cords[1]) < minDist) {
                    this.targetEnemy = enemy;
                    minDist = Math.abs(enemyCord[0] - cords[0]) + Math.abs(enemyCord[1] - cords[1]);
                }
            }
        }

        return true;
    }
}