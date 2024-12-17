import {gameManager} from "./gameManager.js";
import {mapManager} from "./mapManager.js";

class SoundManager {
    constructor() {
        this.clips = {};
        this.context = null;
        this.gainNode = null;
        this.loaded = false;

        this.context = new AudioContext();
        this.gainNode = this.context.createGain ? this.context.createGain() : this.context.createGainNode();
        this.gainNode.connect(this.context.destination);
    }

    load(path, callback) {
        if (this.clips[path]) {
            callback(this.clips[path]);
            return;
        }
        let clip = {path, buffer: null, loaded: false};
        clip.play = (volume, loop) => {
            this.play(path, {
                looping: loop ?? false,
                volume: volume ?? 1
            });
        };

        this.clips[path] = clip;
        let request = new XMLHttpRequest();
        request.open('GET', path, true);
        request.responseType = 'arraybuffer';
        request.onload = () => {
            this.context.decodeAudioData(request.response, buffer => {
                clip.buffer = buffer;
                clip.loaded = true;
                callback(clip);
            });
        };
        request.send();
    }

    loadArray(array) {
        for (let path of array) {
            this.load(path, () => {
                if (array.length === Object.keys(this.clips).length) {
                    for (let sd in this.clips)
                        if (!this.clips[sd].loaded)
                            return;
                    this.loaded = true;
                }
            });
        }
    }

    play(path, settings) {
        if (!this.loaded) {
            setTimeout(() => this.play(path, settings), 1000);
            return;
        }

        const looping = settings?.looping ?? false;
        const volume = settings?.volume ?? 1;

        const sd = this.clips[path];
        if (sd === null) {
            return false;
        }

        let sound = this.context.createBufferSource();
        sound.buffer = sd.buffer;
        sound.connect(this.gainNode);
        sound.loop = looping;
        this.gainNode.gain.value = volume;
        sound.start(0);

        return true;
    }

    playWorldSound(path, x, y) {
        if (gameManager.player === null) {
            return;
        }

        const viewSize = Math.max(mapManager.view.w, mapManager.view.h) * 0.8;
        const dx = Math.abs(gameManager.player.pos_x - x);
        const dy = Math.abs(gameManager.player.pos_y - y);
        const distance = Math.sqrt(dx * dx + dy * dy);

        let norm = distance / viewSize;

        if (norm > 1) {
            norm = 1;
        }

        const volume = 1.0 - norm;

        if (!volume) {
            return;
        }

        this.play(path, {looping: false, volume});
    }

    toggleMute() {
        this.gainNode.gain.value = this.gainNode.gain.value > 0 ? 0 : 1;
    }

    stopAll() {
        this.gainNode.disconnect();
        this.gainNode = this.context.createGain ? this.context.createGain() : this.context.createGainNode();
        this.gainNode.connect(this.context.destination);
    }
}

export const soundManager = new SoundManager();