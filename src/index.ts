import * as ex from "excalibur";
import { Player } from "./actors/player";
import { loader } from "./resources";
import { getStage } from "./stage";


class Game extends ex.Engine {
  public width = 5;
  public height = 5;

  constructor() {
    super({ displayMode: ex.DisplayMode.FitScreen });
  }

  public start() {

    // Create new scene with a player
    // const levelOne = new ex.LevelOne();
    // const player = new Player(game);
    // levelOne.add(player);

    // game.add('levelOne', levelOne);

    const player = new Player(this);
    this.add(player);

    getStage(this, this.width, this.height);

    // // Automatically load all default resources
    // const loader = new ex.Loader(Object.values(Resources));

    return super.start(loader);
  }
}

const game = new Game();
game.start();
// game.start().then(() => {
//   game.goToScene('levelOne');
// });