import * as ex from "excalibur";
import { Player } from "./actors/player";
import { loader, spriteFont, defaultFont, defaultFontLeftAligned, resources, titleSprite, instructionsSprite, defaultFontLeftAlignedSmall } from "./resources";
import { getStage } from "./stage";
import { getCorpses, getCorpseGrid, getConnectedCorpses, setScore, pressed } from "./utils";
import { MainMenu } from "./menu";

class Game extends ex.Engine {
  public width = 5;
  public height = 5;
  public state: ("running" | "gameover" | "menu") = "menu";
  public score = 0;

  public menuCenter = ex.vec(-100, 0);

  public backgroundStage;
  public cameraActor: ex.Actor;
  public gameOverLabel: ex.Label;

  constructor() {
    super({ displayMode: ex.DisplayMode.FitScreen, backgroundColor: ex.Color.fromHex("#3ab643") });
  }

  public start() {

    // Create new scene with a player
    // const levelOne = new ex.LevelOne();
    // const player = new Player(game);
    // levelOne.add(player);

    // game.add('levelOne', levelOne);

    let scoreLabel = new ex.Label({
      text: `SCORE: ${this.score}`,
      pos: ex.vec(-50, -30),
      font: defaultFontLeftAligned,
      name: "score",
      z: 10
    });
    game.add(scoreLabel);


    const title = new ex.Actor({
      pos: this.menuCenter.sub(ex.vec(0, 200)),
      z: 100
    });
    titleSprite.scale = ex.vec(2,2);
    title.graphics.add(titleSprite);
    this.add(title);


    const instructions = new ex.Actor({
      pos: this.menuCenter.sub(ex.vec(180, 0)),
      z: 100
    });
    instructions.graphics.add(instructionsSprite);
    this.add(instructions);


    const instructionLabel = new ex.Label({
      text: (
        "10HEADS are small short lived creatures.\n" + 
        "(THEY ONLY LIVE for 10 SECONDS!)\n" + 
        "Stack 5 of them up to remove them and claim   \n" + // Weird ass bug
        "their score. The bigger the stack the higher\n" +
        "the combo multiplier."
      ),
      pos: this.menuCenter.add(ex.vec(-370, 100)),
      font: defaultFontLeftAlignedSmall,
      z: 100
    });
    this.add(instructionLabel);

    
    this.backgroundStage = getStage(this, this.width, this.height);
    
    this.cameraActor = new ex.Actor({
      x: this.drawWidth / 2,
      y: this.drawHeight / 2,
    });
    game.add(this.cameraActor);


    this.gameOverLabel = new ex.Label({
      text: "GAME OVER",
      pos: this.backgroundStage.pos,
      font: defaultFont,
      z: 100
    });

    return super.start(loader);
  }
}

const game = new Game();
game.start().then(() => {
  game.currentScene.camera.strategy.lockToActor(game.cameraActor);
  // game.currentScene.camera.zoom = 1.6;

  // game.cameraActor.actions.easeTo(game.menuCenter, 1000, ex.EasingFunctions.EaseOutCubic);
  game.cameraActor.pos = game.menuCenter;
  game.currentScene.camera.zoom = 0.5;
  game.currentScene.camera.zoomOverTime(1.0, 1000, ex.EasingFunctions.EaseOutCubic);


  // game.currentScene.camera.act

  // Play song in endless loop
  (async () => {
    while(true) {
      await resources.music.play(0.5);
    }
  })();
});

setInterval(() => {
  console.log(game.state);

  if (game.state != "running") {
    if (game.state == "gameover") {
      if (pressed(game, [ex.Input.Keys.Enter, ex.Input.Keys.Space])) {
        // Go to menu
        game.cameraActor.actions.easeTo(game.menuCenter, 1000, ex.EasingFunctions.EaseOutCubic);
        game.currentScene.camera.zoomOverTime(1.0, 1000, ex.EasingFunctions.EaseOutCubic);
        // game.currentScene.camera.mo

        game.remove(game.gameOverLabel);

        game.state = "menu";
        return;
      }
    }

    else if (game.state == "menu") {
      if (pressed(game, [ex.Input.Keys.Enter, ex.Input.Keys.Space])) {
        // Start game
        game.cameraActor.actions.easeTo(game.backgroundStage.pos, 1000, ex.EasingFunctions.EaseOutCubic);
        game.currentScene.camera.zoomOverTime(1.6, 1000, ex.EasingFunctions.EaseOutCubic);
        
        getCorpses(game).forEach(c => c.die(game));
        
        game.score = 0;
        
        setTimeout(() => {
          const player = new Player(game);
          game.add(player);
        }, 100);

        game.state = "running";
        return;
      }
    }

    return;
  }

  const corpses = getCorpses(game);

  // Check if point
  let chains = getConnectedCorpses(getCorpseGrid(corpses, game.width, game.height), 5);
  let scoreToAdd = 0;
  chains.forEach(chain => {
    chain.forEach(corpse => {
      scoreToAdd += corpse.getPoints();
      corpse.die(game);
    })
    let multiplier = Math.max(1, chain.length - 4);
    game.score += scoreToAdd * multiplier;
  });
  setScore(game, game.score);
  if (chains.length > 0)
    return;

  // Check if game over
  if (corpses.length == (game.width * game.height)) {
    game.add(game.gameOverLabel);

    game.state = "gameover";
  }
}, 100);