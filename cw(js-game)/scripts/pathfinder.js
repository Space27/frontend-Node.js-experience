import {mapManager} from "./manager/mapManager.js";

class Pathfinder {
    constructor() {
        this.defaultHeuristic = (x1, y1, x2, y2) => Math.abs(x2 - x1) + Math.abs(y2 - y1);
        this.defaultNeighbours = (x, y) => [{x: x + 1, y: y}, {x: x - 1, y: y}, {x: x, y: y + 1}, {x: x, y: y - 1}];
    }

    deleteMinElem(list, func = e => e) {
        if (!list || list.length === 0) {
            return null;
        }

        let minI = 0;
        let min = list[minI];

        for (const [i, elem] of list.entries()) {
            if (func(elem) < func(min)) {
                minI = i;
                min = elem;
            }
        }
        list.splice(minI, 1);

        return min;
    }

    findPath(map, x1, y1, x2, y2, options = null) {
        const neighbours = options?.neighbours ?? this.defaultNeighbours;
        const heuristic = options?.heuristic ?? this.defaultHeuristic;
        const maxLen = options?.maxLen ?? Infinity;

        const open = [{x: x1, y: y1, f: heuristic(x1, y1, x2, y2), path: []}];
        const closed = new Set();

        while (open.length > 0) {
            const min = this.deleteMinElem(open, e => e.f);

            if (min.x === x2 && min.y === y2) {
                return min.path;
            } else if (min.f >= maxLen) {
                return null;
            }

            closed.add(JSON.stringify({x: min.x, y: min.y}));
            for (const neighbour of neighbours(min.x, min.y)) {
                const [nx, ny] = [neighbour.x, neighbour.y];
                if (nx >= 0 && ny >= 0 && nx < map[0].length && ny < map.length && map[ny][nx] === 0
                    && !closed.has(JSON.stringify({x: nx, y: ny}))) {
                    const newPath = [...min.path, neighbour];
                    const f = heuristic(nx, ny, x2, y2) + newPath.length;

                    const oldIndex = open.findIndex(node => node.x === nx && node.y === ny);
                    if (oldIndex === -1 || f < open[oldIndex].f) {
                        if (oldIndex !== -1) {
                            open.splice(oldIndex, 1);
                        }
                        open.push({x: nx, y: ny, f, path: newPath});
                    }
                }
            }
        }

        return null;
    }

    onLine(path, x, y, obj) {
        let isVer = path.every(step => step.x === x);
        let isHor = path.every(step => step.y === y);

        if (isVer) {
            let clone = Object.assign({}, obj);

            for (const step of path) {
                clone.pos_y += mapManager.tSize.y * (step.y - mapManager.getCord(clone)[1]);
                if (mapManager.getCord(clone)[0] !== step.x || mapManager.getCord(clone)[1] !== step.y) {
                    isVer = false;
                    break;
                }
            }
        }
        if (isHor) {
            let clone = Object.assign({}, obj);

            for (const step of path) {
                clone.pos_x += mapManager.tSize.x * (step.x - mapManager.getCord(clone)[0]);
                if (mapManager.getCord(clone)[0] !== step.x || mapManager.getCord(clone)[1] !== step.y) {
                    isHor = false;
                    break;
                }
            }
        }

        return isVer || isHor;
    }
}

export const pathfinder = new Pathfinder();