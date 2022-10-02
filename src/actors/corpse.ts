import * as ex from "excalibur";
import { corpseSprite, resources } from "../resources";
import { getPlayer, snap } from "../utils";

// const getHitbox = (x: number, y: number, fixed = true, tileSize = 50) => new ex.Actor({
//     x: fixed ? snap(x, tileSize) : x,
//     y: fixed ? snap(y, tileSize) : y,
//     width: 50,
//     height: 50,
//     collisionType: fixed ? ex.CollisionType.Fixed : ex.CollisionType.Active,
// }).collider.get();

export class Corpse extends ex.Actor {
    public isMoving = false;

    // private staticHitbox = new ex.Actor({
    //     width: 50,
    //     height: 50,
    //     collisionType: ex.CollisionType.Fixed,
    // }).collider.get();

    // private movingHitbox = new ex.Actor({
    //     width: 50,
    //     height: 50,
    //     collisionType: ex.CollisionType.Active,
    // }).collider.get();

    constructor(engine: ex.Engine, x: number, y: number, color: ex.Color) {
        const tileSize = 50;
        super({
            x: snap(x, tileSize),
            y: snap(y, tileSize),
            name: 'corpse', // optionally assign a name
            color: color,
            z: -1,
            width: 50,
            height: 50,
            collisionType: ex.CollisionType.Active,
        })
        // this.collider.set(this.staticHitbox);
        // this.collider.set(getHitbox(this.pos.x, this.pos.y, true));
    }

    public onInitialize() {
        corpseSprite.scale = ex.vec(50 / 16, 50 / 16);
        corpseSprite.tint = this.color.clone();
        this.graphics.add("idle", corpseSprite);
        this.graphics.use("idle");
    }

    public update(engine: ex.Engine, delta: number) {
        if (this.isMoving) {
            // this.collider.set(this.movingHitbox);
            // this.actions.follow(getPlayer(engine));
            // console.log("aa");
            // // this.isMoving = false;
            // this.collider.set(getHitbox(this.pos.x, this.pos.y, false));
            // this.collider.set(this.collider.get());
        }
        else {
            this.pos.x = snap(this.pos.x, 50);
            this.pos.y = snap(this.pos.y, 50);
            // this.actions.clearActions();
            // this.collider.set(this.staticHitbox);
            // console.log("bb");
            // this.collider.set(getHitbox(this.pos.x, this.pos.y, true));
        }
    };
}
