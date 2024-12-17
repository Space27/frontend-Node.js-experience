import {gameManager} from "./gameManager.js";

const COLLISION_DIFF = 20;

class MapManager {
    constructor() {
        this.mapData = null;
        this.tLayer = null;
        this.xCount = 0;
        this.yCount = 0;
        this.tSize = {x: 0, y: 0};
        this.mapSize = {x: 0, y: 0};
        this.tilesets = [];
        this.collision = [];
        this.imgLoadCount = 0;
        this.imgLoaded = false;
        this.jsonLoaded = false;
        this.view = {x: 0, y: 0, w: canvas.width, h: canvas.height};
    }

    loadMap(path) {
        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {
            if (request.readyState === 4 && request.status === 200) {
                this.parseMap(request.responseText);
            }
        };
        request.open("GET", path, true);
        request.send();
    }

    parseMap(tilesJSON) {
        this.mapData = JSON.parse(tilesJSON);
        this.xCount = this.mapData.width;
        this.yCount = this.mapData.height;
        this.tSize.x = this.mapData.tilewidth;
        this.tSize.y = this.mapData.tileheight;
        this.mapSize.x = this.xCount * this.tSize.x;
        this.mapSize.y = this.yCount * this.tSize.y;
        this.collision = new Array(this.yCount).fill(0).map(() => new Array(this.xCount).fill(0));

        for (let layer of this.mapData.layers) {
            if (layer.name.includes('collision')) {
                for (let row = 0; row < this.yCount; ++row) {
                    for (let col = 0; col < this.xCount; ++col) {
                        this.collision[row][col] += layer.data[row * this.xCount + col];
                    }
                }
            }
        }

        for (let tileset of this.mapData.tilesets) {
            const img = new Image();
            img.onload = () => {
                if (++this.imgLoadCount === this.mapData.tilesets.length) {
                    this.imgLoaded = true;
                }
            };

            img.src = tileset.image;
            const t = tileset;
            const ts = {
                firstgid: t.firstgid,
                image: img,
                name: t.name,
                xCount: Math.floor(t.imagewidth / this.tSize.x),
                yCount: Math.floor(t.imageheight / this.tSize.y),
            };
            this.tilesets.push(ts);
        }
        this.jsonLoaded = true;
    }

    parseEntities() {
        if (!this.imgLoaded || !this.jsonLoaded) {
            setTimeout(() => this.parseEntities(), 100);
        } else {
            for (let layer of this.mapData.layers) {
                if (layer.type === 'objectgroup') {
                    for (let e of layer.objects) {
                        if (e.type === "")
                            continue;
                        try {
                            let obj = new gameManager.factory[e.type]();

                            obj.name = e.name;
                            obj.type = e.type;
                            obj.pos_x = Math.ceil(e.x);
                            obj.pos_y = Math.ceil(e.y);
                            obj.size_x = Math.ceil(e.width);
                            obj.size_y = Math.ceil(e.height);

                            gameManager.entities.push(obj);
                            if (obj.name === 'Player') {
                                gameManager.initPlayer(obj);
                            }
                        } catch (ex) {
                            console.log(`Error while creating: [${e.gid}] ${e.type}, ${ex}`);
                        }
                    }
                }
            }
        }
    }

    draw(ctx) {
        if (!this.imgLoaded || !this.jsonLoaded) {
            setTimeout(() => this.draw(ctx), 100);
        } else {
            if (this.tLayer === null) {
                this.tLayer = []
                for (let layer of this.mapData.layers) {
                    if (layer.type === 'tilelayer') {
                        this.tLayer.push(layer);
                    }
                }
            }

            for (let layer of this.tLayer) {
                if (!layer.name.includes('above')) {
                    this.drawLayer(ctx, layer);
                }
            }
        }
    }

    drawAboveEntity(ctx) {
        if (this.tLayer === null) {
            setTimeout(() => this.drawAboveEntity(ctx), 100);
        } else {
            for (let layer of this.tLayer) {
                if (layer.name.includes('above')) {
                    this.drawLayer(ctx, layer);
                }
            }
        }
    }

    drawLayer(ctx, layer) {
        for (let i = 0; i < layer.data.length; ++i) {
            if (layer.data[i] !== 0) {
                let tile = this.getTile(layer.data[i]);
                let pX = (i % this.xCount) * this.tSize.x;
                let pY = Math.floor(i / this.xCount) * this.tSize.y;
                if (this.isVisible(pX, pY, this.tSize.x, this.tSize.y)) {
                    pX -= this.view.x;
                    pY -= this.view.y;
                    ctx.drawImage(tile.img, tile.px, tile.py, this.tSize.x, this.tSize.y, pX, pY, this.tSize.x, this.tSize.y);
                }
            }
        }
    }

    getTile(tileIndex) {
        const tile = {
            img: null,
            px: 0,
            py: 0,
        };

        const tileset = this.getTileset(tileIndex);
        tile.img = tileset.image;
        const id = tileIndex - tileset.firstgid;
        const x = id % tileset.xCount;
        const y = Math.floor(id / tileset.xCount);
        tile.px = x * this.tSize.x;
        tile.py = y * this.tSize.y;

        return tile;
    }

    getTileset(tileIndex) {
        for (let i = this.tilesets.length - 1; i >= 0; --i) {
            if (this.tilesets[i].firstgid <= tileIndex) {
                return this.tilesets[i];
            }
        }

        return null;
    }

    centerAt(x, y) {
        if (x < this.view.w / 2)
            this.view.x = 0;
        else if (x > this.mapSize.x - this.view.w / 2)
            this.view.x = this.mapSize.x - this.view.w;
        else
            this.view.x = x - (this.view.w / 2);

        if (y < this.view.h / 2)
            this.view.y = 0;
        else if (y > this.mapSize.y - this.view.h / 2)
            this.view.y = this.mapSize.y - this.view.h;
        else
            this.view.y = y - (this.view.h / 2);
    }

    isVisible(x, y, width, height) {
        return !(x + width < this.view.x || y + height < this.view.y || x > this.view.x + this.view.w || y > this.view.y + this.view.h);
    }

    isCollision(x, y, obj) {
        let leftX = Math.floor(x / this.tSize.x);
        let rightX = Math.floor((x + obj.size_x - 1) / this.tSize.x);
        let topY = Math.floor(y / this.tSize.y);
        let bottomY = Math.floor((y + obj.size_y - 1) / this.tSize.y);

        if (leftX < 0 || topY < 0 || rightX >= this.xCount || bottomY >= this.yCount) {
            return true;
        }

        topY = Math.floor((y + obj.size_y / 2 - 1) / this.tSize.y);

        for (let i = topY; i <= bottomY; ++i) {
            for (let j = leftX; j <= rightX; ++j) {
                if (this.collision[i][j] !== 0) {
                    return true;
                }
            }
        }

        return false;
    }

    getCord(obj) {
        let leftX = Math.floor(obj.pos_x / this.tSize.x);
        let rightX = Math.floor((obj.pos_x + obj.size_x - 1) / this.tSize.x);
        let topY = Math.floor((obj.pos_y + obj.size_y / 2 - 1) / this.tSize.y);
        let bottomY = Math.floor((obj.pos_y + obj.size_y - 1) / this.tSize.y);

        let cordX = leftX;
        let cordY = topY;

        if (topY + 1 < this.yCount && this.collision[topY + 1][rightX] !== 0
            || topY - 1 >= 0 && this.collision[topY - 1][rightX] !== 0) {
            cordX = rightX;
        }
        if (leftX + 1 < this.xCount && this.collision[bottomY][leftX + 1] !== 0
            || leftX - 1 >= 0 && this.collision[bottomY][leftX - 1] !== 0) {
            cordY = bottomY;
        }

        return [cordX, cordY];
    }
}

export const mapManager = new MapManager();