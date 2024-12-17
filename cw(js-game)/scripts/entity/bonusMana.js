import {Entity} from "./entity.js";

export class BonusMana extends Entity {
    constructor() {
        super();
        this.name = 'Mana';
    }

    getSpriteName() {
        return 'mana';
    }
}