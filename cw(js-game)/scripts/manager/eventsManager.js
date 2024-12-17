class EventsManager {
    constructor() {
        this.bind = [];
        this.action = [];
    }

    setup(canvas) {
        this.bind['ArrowUp'] = 'up';
        this.bind['ArrowLeft'] = 'left';
        this.bind['ArrowDown'] = 'down';
        this.bind['ArrowRight'] = 'right';
        this.bind['w'] = 'up';
        this.bind['a'] = 'left';
        this.bind['s'] = 'down';
        this.bind['d'] = 'right';
        this.bind['ц'] = 'up';
        this.bind['ф'] = 'left';
        this.bind['ы'] = 'down';
        this.bind['в'] = 'right';
        this.bind[' '] = 'fire';
        this.bind['q'] = 'ult';
        this.bind['й'] = 'ult';
        this.bind['e'] = 'shield';
        this.bind['у'] = 'shield';

        canvas.addEventListener('mousedown', e => this.onMouseDown(e));
        canvas.addEventListener('mouseup', e => this.onMouseUp(e));
        document.body.addEventListener('keydown', e => this.onKeyDown(e));
        document.body.addEventListener('keyup', e => this.onKeyUp(e));
    }

    onMouseDown(event) {
        this.action['fire'] = true;
    }

    onMouseUp(event) {
        this.action['fire'] = false;
    }

    onKeyDown(event) {
        const action = this.bind[event.key];
        if (action) {
            this.action[action] = true;
        }
    }

    onKeyUp(event) {
        const action = this.bind[event.key];
        if (action) {
            this.action[action] = false;
        }
    }
}

export const eventsManager = new EventsManager();