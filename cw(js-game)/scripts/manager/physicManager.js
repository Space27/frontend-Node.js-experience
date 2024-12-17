import {mapManager} from "./mapManager.js";
import {gameManager} from "./gameManager.js";

class PhysicManager {
    update(obj) {
        if (obj.move_x === 0 && obj.move_y === 0) {
            return 'stop';
        }

        const newX = obj.pos_x + Math.floor(obj.move_x * obj.speed);
        const newY = obj.pos_y + Math.floor(obj.move_y * obj.speed);

        let e = this.entityAtXY(obj, newX, newY);
        if (e && obj.onTouchEntity) {
            obj.onTouchEntity(e);
        }
        if (obj.onTouchMap && mapManager.isCollision(newX, newY, obj)) {
            obj.onTouchMap();
        }

        if (!mapManager.isCollision(newX, newY, obj)) {
            obj.pos_x = newX;
            obj.pos_y = newY;
        } else if (!mapManager.isCollision(obj.pos_x, newY, obj)) {
            obj.pos_y = newY;
        } else if (!mapManager.isCollision(newX, obj.pos_y, obj)) {
            obj.pos_x = newX;
        } else {
            return 'break';
        }

        return 'move';
    }

    entityAtXY(obj, x, y) {
        for (let e of gameManager.entities) {
            if (e.name !== obj.name) {
                if (x + obj.size_x >= e.pos_x && y + obj.size_y >= e.pos_y && x <= e.pos_x + e.size_x && y <= e.pos_y + e.size_y) {
                    return e;
                }
            }
        }

        return null;
    }
}

export const physicManager = new PhysicManager();