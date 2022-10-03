import * as ex from "excalibur";
import { numbersSpitesheet, playerBlankSpitesheet, playerDetailsSpitesheet } from "../resources";
import { getCorpses, overlapsCorpse, pressed, randomChoice, snap } from "../utils";
import { Corpse } from "./corpse";

const randomColor = () => {
    const rgb = [170, 170, 170];
    rgb[ex.randomIntInRange(0, 2)] = 255;
    return new ex.Color(rgb[0], rgb[1], rgb[2], rgb[3]);
    // return ex.Color.fromHSL(randomChoice([1, 3, 7]) / 10, 1, 0.5);
}

export class Player extends ex.Actor {
    private speed = 300;
    private age = 0;
    private tileSize = 50;
    private boardHW = 5;
    private scaleVector = ex.vec(this.tileSize / 16, this.tileSize / 16);
    private timeoutID;
    public direction: ex.Vector = ex.Vector.Zero;
    // private hue = randomChoice([0, 2.5, 5, 7.5]) / 10;
    private hue = randomChoice([0, 0.08, 0.165, 0.48, 0.58, 0.91 ]);
    private movingCorpse = undefined;
    // private gameReference: ex.Engine;

    constructor(engine: ex.Engine) {
        super({
            x: engine.drawWidth / 2,
            y: engine.drawHeight / 2,
            z: -2,
            name: 'player', // optionally assign a name
            // width: 50,
            // height: 50,
            color: randomColor(),
            collider: new ex.PolygonCollider({
                points: [
                    ex.vec(-25, -31),
                    ex.vec(-25, 19),
                    ex.vec(25, 19),
                    ex.vec(25, -31),
                ]
            }),
            collisionType: ex.CollisionType.Active
        })

        // this.gameReference = engine;

        let ok = false;
        while (!ok) {
            let x = this.tileSize * (ex.randomIntInRange(0, this.boardHW - 1) + 0.5);
            let y = this.tileSize * (ex.randomIntInRange(0, this.boardHW - 1) + 0.5);

            x = snap(x, this.tileSize);
            y = snap(y, this.tileSize);

            this.pos.x = x;
            this.pos.y = y;

            if (!overlapsCorpse(engine, x, y)) {
                ok = true;
            }

            if (getCorpses(engine).length >= this.boardHW*this.boardHW) {
                throw new Error("No room to create player");
            }
        }
    }

    public onInitialize(engine: ex.Engine) {
        for (let j = 0; j < 10; j++) {
            let i = Math.floor(j / 2);
            let numberSprite = numbersSpitesheet.getSprite(0, j)!;

            // Idle group
            let idleBlank = playerBlankSpitesheet.getSprite(0, i)!;
            idleBlank.tint = ex.Color.fromHSL(this.hue, 1, 0.5 + this.age / 50, 1);
            let idleDetail = playerDetailsSpitesheet.getSprite(0, i)!;
            const idle = new ex.GraphicsGroup({
                members: [
                    {
                        graphic: idleBlank,
                        pos: ex.vec(0, 0)
                    },
                    {
                        graphic: idleDetail,
                        pos: ex.vec(0, 0)
                    },
                    {
                        graphic: numberSprite,
                        pos: ex.vec(0, 0)
                    },
                ]
            });
            idle.scale = this.scaleVector;
            this.graphics.add(`idle${j}`, idle);

            // Walking group
            let walkingBlank = ex.Animation.fromSpriteSheet(playerBlankSpitesheet, [(i * 3) + 1, (i * 3) + 2], 90);
            walkingBlank.tint = ex.Color.fromHSL(this.hue, 1, 0.5 + this.age / 50, 1);
            let walkingDetail = ex.Animation.fromSpriteSheet(playerDetailsSpitesheet, [(i * 3) + 1, (i * 3) + 2], 90);
            const walking = new ex.GraphicsGroup({
                members: [
                    {
                        graphic: walkingBlank,
                        pos: ex.vec(0, 0)
                    },
                    {
                        graphic: walkingDetail,
                        pos: ex.vec(0, 0)
                    },
                    {
                        graphic: numberSprite,
                        pos: ex.vec(0, 0)
                    },
                ]
            });
            walking.scale = this.scaleVector;
            this.graphics.add(`walking${j}`, walking);
        }

        this.graphics.use("idle0");

        this.timeoutID = setInterval(() => {
            this.age += 0.1;
            if (this.age >= 10) {
                this.die(engine);
            }
            Object.keys(this.graphics.graphics).forEach((key, index) => {
                (this.graphics.graphics[key] as ex.GraphicsGroup).members[0].graphic.tint = ex.Color.fromHSL(this.hue, 1 - (this.age / 20), 0.5, 1);
                // this.graphics.graphics[key].tint = ex.Color.fromHSL(this.hue, 1-(this.age / 10), 0.5 + this.age / 50, 1);
            });
        }, 100)
    }

    public async die(engine: ex.Engine) {
        clearTimeout(this.timeoutID);
        if (!!this.movingCorpse)
            this.movingCorpse.isMoving = false;
        engine.add(new Corpse(engine, this.pos.x, this.pos.y, [this.hue, 1 - (this.age / 20), 0.5, 1], this.age));
        this.kill();

        setTimeout(() => {
            if (getCorpses(engine).length < (this.boardHW * this.boardHW)) {
                engine.add(new Player(engine));
            }
        }, 100);
    }

    private getCorpseInFrontOfPlayer(engine: ex.Engine) {
        for (let corpse of getCorpses(engine)) {
            if (this.pos.add(this.direction.scale(this.tileSize)).distance(corpse.pos) < this.tileSize / 2) {
                return corpse;
            }
        }

        return undefined;
    }

    public update(engine: ex.Engine, delta: number) {
        this.vel.x = 0;
        this.vel.y = 0;
        if (pressed(engine, [ex.Input.Keys.W, ex.Input.Keys.Up])) {
            this.vel.y = -1;
            this.direction = ex.Vector.Up;
        }
        if (pressed(engine, [ex.Input.Keys.A, ex.Input.Keys.Left])) {
            this.vel.x = -1;
            this.direction = ex.Vector.Left;
        }
        if (pressed(engine, [ex.Input.Keys.S, ex.Input.Keys.Down])) {
            this.vel.y = 1;
            this.direction = ex.Vector.Down;
        }
        if (pressed(engine, [ex.Input.Keys.D, ex.Input.Keys.Right])) {
            this.vel.x = 1;
            this.direction = ex.Vector.Right;
        }

        if (pressed(engine, [ex.Input.Keys.K]) && this.age > 0.1) {
            this.die(engine);
        }

        if (this.vel.size != 0) {
            this.vel = this.vel.normalize().scale(this.speed);
            this.graphics.use(`walking${Math.min(9, Math.floor(this.age))}`);
        }
        else {
            this.graphics.use(`idle${Math.min(9, Math.floor(this.age))}`);
            this.direction = ex.Vector.Zero;
        }

        if (pressed(engine, [ex.Input.Keys.Space])) {
            if (this.movingCorpse === undefined) {
                this.movingCorpse = this.getCorpseInFrontOfPlayer(engine);
                if (this.movingCorpse !== undefined) {
                    this.movingCorpse.isMoving = true;
                    this.movingCorpse.actions.follow(this);
                }
            }
        }
        if (engine.input.keyboard.wasReleased(ex.Input.Keys.Space)) {
            if (this.movingCorpse !== undefined) {
                // Stop moving old corpse
                this.movingCorpse.isMoving = false;
                this.movingCorpse.actions.clearActions();
                this.movingCorpse = undefined;
            }
        }
    }
}
