class Rules {
    constructor(info) {
        this.info = info;
    }

    scoreAdd = {
        0: 0,
        1: 100,
        2: 300,
        3: 500,
        4: 800
    }

    calcTick() {
        let speed = (0.8 - this.info.level * 0.007) ** this.info.level;
        return 300 * speed;
    }

    addStripes(lines) {
        this.info.score += this.scoreAdd[lines];
        this.info.level = Math.floor(this.info.score / 300);
    }
}

export {Rules}