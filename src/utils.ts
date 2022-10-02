import * as ex from "excalibur";
import { Corpse } from "./actors/corpse";
import { Player } from "./actors/player";

export const pressed = (engine: ex.Engine, keys: Array<ex.Input.Keys>) => keys.some(k => engine.input.keyboard.isHeld(k));

export const gridSnap = (coord: number, tileSize = 50) => Math.floor(coord / tileSize);

export const snap = (coord: number, tileSize = 50) => tileSize * gridSnap(coord, tileSize) + tileSize / 2;

export const getCorpses = (engine: ex.Engine) => engine.currentScene.world.entityManager.entities.filter(a => a.name == "corpse") as Array<Corpse>;

export const getPlayer = (engine: ex.Engine) => engine.currentScene.world.entityManager.entities.find(a => a.name == "player") as Player;

export const setScore = (engine: ex.Engine, score: number) => {
    let label = engine.currentScene.world.entityManager.entities.find(a => a.name == "score") as ex.Label;
    label.text = `SCORE: ${score}`;
};

export const overlapsCorpse = (engine: ex.Engine, x: number, y: number) => getCorpses(engine).some(c => c.pos.distance(ex.vec(x, y)) < 25);

export const randomChoice = (arr) => arr[Math.floor(arr.length * Math.random())];

const empty2DArray = (h: number, w: number, fill: any) => new Array(h)
    .fill(fill)
    .map(() =>
        new Array(w).fill(fill)
    );

export const getCorpseGrid = (corpses: Array<Corpse>, width: number, height: number, blocksize = 50) => {
    let grid: (Corpse | undefined)[][] = empty2DArray(height, width, undefined);

    for (let corpse of corpses) {
        if (!corpse.isMoving) {
            let x = gridSnap(corpse.pos.x, blocksize)
            let y = gridSnap(corpse.pos.y, blocksize)
            grid[x][y] = corpse;
        }
    }

    return grid;
}

const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

const kind = (c: Corpse) => c.hsla[0];

const isSameKind = (c1: Corpse, c2: Corpse) => kind(c1) == kind(c2);


export const getConnectedCorpses = (corpseGrid: (Corpse | undefined)[][], length = 3) => {
    // Kinda working lol
    let cols = corpseGrid.length;
    let rows = corpseGrid[0].length;

    let checked: boolean[][] = empty2DArray(cols, rows, false);

    let chains: Array<Array<Corpse>> = [];

    for (let y = 0; y < cols; y++) {
        for (let x = 0; x < rows; x++) {
            if (checked[y][x])
                continue;

            let corpse = corpseGrid[y][x];
            if (corpse === undefined) {
                checked[y][x] = true;
                continue;
            }

            let k = kind(corpse);

            let checkChain = [];
            let corpseChain = [];

            checkChain.push([y, x]);

            let localChecked: boolean[][] = empty2DArray(cols, rows, false);

            while (checkChain.length > 0) {
                let [cy, cx] = checkChain.shift();

                let localCorpse = corpseGrid[cy][cx];
                localChecked[cy][cx] = true;

                if (kind(localCorpse) == k) {
                    checked[cy][cx] = true;
                    corpseChain.push(localCorpse);

                    // push neighbors if not checked or undefined
                    [
                        [clamp(cy + 1, 0, cols - 1), cx],
                        [clamp(cy - 1, 0, cols - 1), cx],
                        [cy, clamp(cx + 1, 0, rows - 1)],
                        [cy, clamp(cx - 1, 0, rows - 1)],
                    ].forEach(([ly, lx]) => {
                        if (!localChecked[ly][lx] && !!corpseGrid[ly][lx])
                            checkChain.push([ly, lx]);
                    });
                }
            }
            if (corpseChain.length >= length) {
                chains.push(corpseChain);
            }
        }
    }

    return chains;
}

export const textFloatAnimation = async (actor: ex.Actor): Promise<void> => {
    const moveSequence = new ex.ActionSequence(actor, ctx => {
        ctx.easeBy(ex.vec(0, -100), 1000)
    });

    const fadeSequence = new ex.ActionSequence(actor, ctx => {
        // ctx.delay(100); // optionally delay 100 milliseconds
        ctx.fade(0, 1000);
    });

    const parallel = new ex.ParallelActions([moveSequence, fadeSequence]);
    // oops runAction() doesn't return the ActionContext will fix soon
    actor.actions.runAction(parallel);
    await actor.actions.toPromise();
}