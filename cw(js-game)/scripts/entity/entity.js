import {spriteManager} from "../manager/spriteManager.js";
import {gameManager} from "../manager/gameManager.js";

export class Entity {
    constructor() {
        this.name = '';
        this.type = '';
        this.pos_x = 0;
        this.pos_y = 0;
        this.size_x = 0;
        this.size_y = 0;
    }

    kill() {
        gameManager.kill(this);
    }

    draw(ctx) {
        spriteManager.drawSprite(ctx, this, this.pos_x, this.pos_y);
    }
}