import * as ex from "excalibur";
import { Player } from "./player";
import { loader } from "./resources";
import { getStage } from "./stage";

const game = new ex.Engine({
  // width: 800,
  // height: 600,
  canvasElementId: "game"
});

const player = new Player(game);

game.add(player);

const bricks = getStage(game, 5, 5);
bricks.forEach(brick => {
  brick.body.collisionType = ex.CollisionType.Fixed;

  game.add(brick);
});


await game.start(loader);

console.log(game);