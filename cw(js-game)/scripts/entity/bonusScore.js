import {Entity} from "./entity.js";

export class BonusScore extends Entity {
    constructor() {
        super();
        this.name = 'Score';
        this.iteration = 0;
        this.iterDelay = 0;
        this.iterMaxDelay = Math.floor(FPS / 8);
    }

    update() {
        this.iterDelay = (this.iterDelay + 1) % this.iterMaxDelay;
        this.iteration = (this.iteration + (this.iterDelay === 0 ? 1 : 0)) % 8;
    }

    getSpriteName() {
        return `coin_${this.iteration}`;
    }
}