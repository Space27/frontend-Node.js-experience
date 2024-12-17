import {mapManager} from "./mapManager.js";

class SpriteManager {
    constructor() {
        this.images = {};
        this.sprites = [];
        this.imgLoadCount = 0;
        this.imgToLoad = 0;
        this.imgLoaded = false;
        this.jsonLoaded = false;
    }

    loadAtlas(atlasMap) {
        this.imgToLoad = Object.keys(atlasMap).length;

        for (const [atlasJson, atlasImg] of Object.entries(atlasMap)) {
            const request = new XMLHttpRequest();

            request.onreadystatechange = () => {
                if (request.readyState === 4 && request.status === 200) {
                    this.parseAtlas(request.responseText, new URL(atlasImg, import.meta.url));
                }
            };

            request.open("GET", new URL(atlasJson, import.meta.url), true);
            request.send();
            this.loadImg(new URL(atlasImg, import.meta.url));
        }
    }

    loadImg(imgName) {
        const image = new Image();
        image.onload = () => {
            if (++this.imgLoadCount >= this.imgToLoad) {
                this.imgLoaded = true;
            }
        };
        this.images[imgName] = image;
        image.src = imgName;
    }

    parseAtlas(atlasJSON, imageName) {
        let atlas = JSON.parse(atlasJSON);

        for (let name in atlas.frames) {
            let frame = atlas.frames[name].frame;
            this.sprites.push({name, x: frame.x, y: frame.y, w: frame.w, h: frame.h, img: imageName});
        }

        this.jsonLoaded = true;
    }

    drawSprite(ctx, obj, x, y) {
        if (!this.imgLoaded || !this.jsonLoaded) {
            setTimeout(() => this.drawSprite(ctx, obj, x, y), 100);
        } else if (obj.getSpriteName) {
            const sprite = this.getSprite(obj.getSpriteName());

            if (!mapManager.isVisible(x, y, sprite.w, sprite.h)) {
                return;
            }
            x -= mapManager.view.x;
            y -= mapManager.view.y;

            const image = this.images[sprite.img];

            if (image && image.complete) {
                const xDiff = Math.ceil((obj.size_x - sprite.w) / 2);
                const yDiff = Math.ceil((obj.size_y - sprite.h) / 2);

                ctx.drawImage(image, sprite.x, sprite.y, sprite.w, sprite.h, x + xDiff, y + yDiff, sprite.w, sprite.h);
            }
        }
    }

    getSprite(name) {
        return this.sprites.find(s => s.name === name) ?? null;
    }
}

export const spriteManager = new SpriteManager();