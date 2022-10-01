import * as ex from "excalibur";
import { playerSpitesheet, resources } from "./resources";

const pressed = (engine: ex.Engine, keys: Array<ex.Input.Keys>) => keys.some(k => engine.input.keyboard.isHeld(k));

export class Player extends ex.Actor {
    constructor(engine: ex.Engine) {
        super({
            x: engine.drawWidth / 2,
            y: engine.drawHeight / 2,
            name: 'player', // optionally assign a name
            width: 50,
            height: 50,
            color: ex.Color.Red,
            collisionType: ex.CollisionType.Active
        })
    }

    public onInitialize(engine: ex.Engine) {
        const idle = playerSpitesheet.getSprite(0,0)!;
        idle.scale = new ex.Vector(50/16, 50/16);

        this.graphics.add("idle", idle);
    }

    private speed = 200;

    public update(engine: ex.Engine, delta: number) {
        this.vel.x = 0;
        this.vel.y = 0;
        if (pressed(engine, [ex.Input.Keys.W, ex.Input.Keys.Up])) {
            this.vel.y = -1;
        }
        if (pressed(engine, [ex.Input.Keys.A, ex.Input.Keys.Left])) {
            this.vel.x = -1;
        }
        if (pressed(engine, [ex.Input.Keys.S, ex.Input.Keys.Down])) {
            this.vel.y = 1;
        }
        if (pressed(engine, [ex.Input.Keys.D, ex.Input.Keys.Right])) {
            this.vel.x = 1;
        }

        if (this.vel.size != 0) {
            this.vel = this.vel.normalize().scale(this.speed);
        }
    }
}
