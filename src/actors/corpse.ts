import * as ex from "excalibur";
import { corpseSprite, numbersSpitesheet, resources } from "../resources";
import { getPlayer, snap, textFloatAnimation } from "../utils";

export class Corpse extends ex.Actor {
    public isMoving = false;
    public age: number;
    public hsla: [number, number, number, number];

    constructor(engine: ex.Engine, x: number, y: number, hsla: [number, number, number, number], age: number) {
        const tileSize = 50;
        super({
            x: snap(x, tileSize),
            y: snap(y, tileSize),
            name: 'corpse',
            color: ex.Color.fromHSL(hsla[0], hsla[1], hsla[2], hsla[3]),
            z: -1,
            width: 50,
            height: 50,
            collisionType: ex.CollisionType.Active,
        })
        this.age = age;
        this.hsla = hsla;
    }

    public onInitialize() {
        let bodySprite = corpseSprite.clone();
        bodySprite.tint = this.color;

        let numberSprite = numbersSpitesheet.getSprite(0, Math.min(9, Math.floor(this.age)))!;

        const sprite = new ex.GraphicsGroup({
            members: [
                {
                    graphic: bodySprite,
                    pos: ex.vec(0, 4)
                },
                {
                    graphic: numberSprite,
                    pos: ex.vec(-1, 4)
                }
            ]
        });

        sprite.scale = ex.vec(50 / 16, 50 / 16);
        this.graphics.add("idle", sprite);
        this.graphics.use("idle");
    }

    public update(engine: ex.Engine, delta: number) {
        if (this.isMoving) {

        }
        else {
            this.pos.x = snap(this.pos.x, 50);
            this.pos.y = snap(this.pos.y, 50);
        }
    };

    public getPoints() {
        return Math.max(1, 10 - Math.floor(this.age));
    }

    public die(engine: ex.Engine) {
        let emitter = new ex.ParticleEmitter({
            pos: this.pos.sub(ex.vec(this.width, this.width).scale(0.5)),
            width: this.width,
            height: this.height,
            emitterType: ex.EmitterType.Rectangle,
            radius: 0,
            minVel: 200,
            maxVel: 150,
            minAngle: 0,
            maxAngle: 6.2,
            isEmitting: true,
            emitRate: 500,
            opacity: 1,
            fadeFlag: true,
            particleLife: 2000,
            maxSize: 5,
            minSize: 1,
            startSize: 0,
            endSize: 0,
            acceleration: new ex.Vector(0, 500),
            beginColor: this.color,
            endColor: ex.Color.Transparent,
            random: new ex.Random(this.id)
        });

        let numberSprite = (this.graphics.graphics["idle"] as ex.GraphicsGroup).members[1].graphic.clone();
        numberSprite.scale = ex.vec(50 / 16, 50 / 16);

        let floatText = new ex.Actor({
            pos: this.pos,
        })
        floatText.on('initialize', (evt) => {
            floatText.graphics.add("idle", numberSprite);
            floatText.graphics.use("idle");
        });
        engine.add(floatText);

        textFloatAnimation(floatText);

        engine.add(emitter);

        setTimeout(() => {
            emitter.isEmitting = false;
        }, 100);

        setTimeout(() => {
            emitter.kill();
            floatText.kill();
        }, 1000);

        this.kill();
    }
}
