import * as ex from "excalibur";
import { playerSpitesheet, resources } from "../resources";
import { getCorpses, overlapsCorpse, randomChoice, snap } from "../utils";
import { Corpse } from "./corpse";

const pressed = (engine: ex.Engine, keys: Array<ex.Input.Keys>) => keys.some(k => engine.input.keyboard.isHeld(k));

const randomColor = () => {
    const rgb = [170, 170, 170];
    rgb[ex.randomIntInRange(0, 2)] = 255;
    return new ex.Color(rgb[0], rgb[1], rgb[2], rgb[3]);
    // return ex.Color.fromHSL(randomChoice([1, 3, 7]) / 10, 1, 0.5);
}

export class Player extends ex.Actor {
    private speed = 200;
    private age = 0;
    private tileSize = 50;
    private boardHW = 5;
    private scaleVector = ex.vec(this.tileSize / 16, this.tileSize / 16);
    private timeoutID;
    public direction: ex.Vector = ex.Vector.Zero;
    private sprites = [];
    private hue = ex.randomIntInRange(0, 1);
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
        console.log(randomColor());

        // this.gameReference = engine;

        let ok = false;
        while (!ok) {
            // let x = ex.randomInRange(this.tileSize * this.boardHW / 2 + this.tileSize / 2, this.tileSize * this.boardHW / 2 - this.tileSize / 2);
            // let y = ex.randomInRange(this.tileSize * this.boardHW / 2 + this.tileSize / 2, this.tileSize * this.boardHW / 2 - this.tileSize / 2);
            let x = this.tileSize * (ex.randomIntInRange(0, this.boardHW - 1) + 0.5);
            let y = this.tileSize * (ex.randomIntInRange(0, this.boardHW - 1) + 0.5);

            x = snap(x, this.tileSize);
            y = snap(y, this.tileSize);

            this.pos.x = x;
            this.pos.y = y;

            if (getCorpses(engine).length == (this.boardHW * this.boardHW)) {
                alert("game over");
                throw new Error();
                // TODO
            }
            if (!overlapsCorpse(engine, x, y)) {
                ok = true;
            }
        }
    }

    public onInitialize(engine: ex.Engine) {
        for (let i = 0; i < 5; i++) {
            let idle = playerSpitesheet.getSprite(0, i)!;
            idle.scale = this.scaleVector;
            idle.tint = ex.Color.fromHSL(this.hue, 1, 0.5 + this.age / 50, 1);
            this.graphics.add(`idle${i}`, idle);

            let walking = ex.Animation.fromSpriteSheet(playerSpitesheet, [(i * 3) + 1, (i * 3) + 2], 150);;
            walking.scale = this.scaleVector;
            walking.tint = ex.Color.fromHSL(this.hue, 1, 0.5 + this.age / 50, 1);
            this.graphics.add(`walking${i}`, walking);

            this.sprites.push(idle, walking);
        }

        this.graphics.use("idle0");

        this.timeoutID = setInterval(() => {
            this.age += 0.1;
            if (this.age > 10) {
                this.die(engine);
            }
            // Object.keys(this.graphics.graphics).forEach((key, index) => {
            //     this.graphics.graphics[key].tint = ex.Color.fromHSL(this.hue, 1-(this.age / 10), 0.5 + this.age / 50, 1);
            // });
        }, 100)
    }

    public async die(engine: ex.Engine) {
        clearTimeout(this.timeoutID);
        if (!!this.movingCorpse)
            this.movingCorpse.isMoving = false;
        engine.add(new Corpse(engine, this.pos.x, this.pos.y, new ex.Color(127, 127, 127)));
        this.kill();
        engine.add(new Player(engine));
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
            this.graphics.use(`walking${Math.floor(this.age / 2)}`);
        }
        else {
            this.graphics.use(`idle${Math.floor(this.age / 2)}`);
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
            // const corpse = this.getCorpseInFrontOfPlayer(engine);
            // if (this.movingCorpse !== corpse) {
            //     if (this.movingCorpse !== undefined) {
            //         // Stop moving old corpse
            //         this.movingCorpse.isMoving = false;
            //         this.movingCorpse.actions.clearActions();
            //     }
            //     if (corpse !== undefined) {
            //         // Start moving new corpse
            //         corpse.isMoving = true;
            //         corpse.actions.follow(this);
            //     }
            //     this.movingCorpse = corpse;
            // }
        }
        if (engine.input.keyboard.wasReleased(ex.Input.Keys.Space)) {
            if (this.movingCorpse !== undefined) {
                // Stop moving old corpse
                this.movingCorpse.isMoving = false;
                this.movingCorpse.actions.clearActions();
                this.movingCorpse = undefined;
            }
        }

        // if (this.direction.size > 0 && pressed(engine, [ex.Input.Keys.Space])) {
        //     const corpse = this.getCorpseInFrontOfPlayer(engine);
        //     if (!!corpse) {
        //         corpse.isMoving = true;
        //         // corpse.collider.set(new ex.Actor({
        //         //     x: corpse.pos.x,
        //         //     y: corpse.pos.y,
        //         //     collisionType: ex.CollisionType.Active,
        //         // }).collider.get());
        //         // corpse.actions.follow(this);
        //     }
        // }
    }
}
