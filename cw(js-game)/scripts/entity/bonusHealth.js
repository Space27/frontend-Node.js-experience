import {Entity} from "./entity.js";

export class BonusHealth extends Entity {
    constructor() {
        super();
        this.name = 'Health';
    }

    getSpriteName() {
        return 'health';
    }
}