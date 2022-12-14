import * as ex from 'excalibur';

export const playerBlankSpitesheetFile = require('./res/player_empty_gray.png');
export const playerDetailsSpitesheetFile = require('./res/player_details.png');
export const corpseFile = require('./res/corpse.png');
export const numbersFile = require('./res/numbers.png');
export const edgeTileFile = require('./res/edgetile.png');
export const backgroundFile = require('./res/background.png');
export const titleFile = require('./res/logo.png');
export const instructionsFile = require('./res/instructions.png');
export const musicFile = require('./res/music.wav');


export const resources = {
    playerBlank: new ex.ImageSource(playerBlankSpitesheetFile),
    playerDetails: new ex.ImageSource(playerDetailsSpitesheetFile),
    corpse: new ex.ImageSource(corpseFile),
    numbers: new ex.ImageSource(numbersFile),
    edgeTile: new ex.ImageSource(edgeTileFile),
    background: new ex.ImageSource(backgroundFile),
    title: new ex.ImageSource(titleFile),
    instructions: new ex.ImageSource(instructionsFile),
    music: new ex.Sound(musicFile),
}

export const playerBlankSpitesheet = ex.SpriteSheet.fromImageSource({
    image: resources.playerBlank,
    grid: {
        rows: 5,
        columns: 3,
        spriteWidth: 24,
        spriteHeight: 20
    }
});

export const playerDetailsSpitesheet = ex.SpriteSheet.fromImageSource({
    image: resources.playerDetails,
    grid: {
        rows: 5,
        columns: 3,
        spriteWidth: 24,
        spriteHeight: 20
    }
});

export const corpseSprite = resources.corpse.toSprite();

export const numbersSpitesheet = ex.SpriteSheet.fromImageSource({
    image: resources.numbers,
    grid: {
        rows: 10,
        columns: 1,
        spriteWidth: 24,
        spriteHeight: 20
    }
});

export const edgeTileSprite = resources.edgeTile.toSprite();

export const backgroundSprite = resources.background.toSprite();

export const titleSprite = resources.title.toSprite();

export const instructionsSprite = resources.instructions.toSprite();

export const defaultFont = new ex.Font({
    size: 30,
    unit: ex.FontUnit.Px,
    family: 'sans-serif',
    style: ex.FontStyle.Normal,
    bold: true,
    textAlign: ex.TextAlign.Center,
    baseAlign: ex.BaseAlign.Alphabetic,
    direction: ex.Direction.LeftToRight,
    color: ex.Color.White,
    smoothing: false,
    shadow: {
        blur: 2,
        offset: ex.vec(2, 2),
        color: ex.Color.Black,
    }
})

export const defaultFontLeftAligned = new ex.Font({
    size: 30,
    unit: ex.FontUnit.Px,
    family: 'sans-serif',
    style: ex.FontStyle.Normal,
    bold: true,
    textAlign: ex.TextAlign.Left,
    baseAlign: ex.BaseAlign.Alphabetic,
    direction: ex.Direction.LeftToRight,
    color: ex.Color.White,
    smoothing: false,
    shadow: {
        blur: 2,
        offset: ex.vec(2, 2),
        color: ex.Color.Black,
    }
})

export const defaultFontLeftAlignedSmall = new ex.Font({
    size: 18,
    unit: ex.FontUnit.Px,
    family: 'sans-serif',
    style: ex.FontStyle.Normal,
    bold: false,
    textAlign: ex.TextAlign.Left,
    baseAlign: ex.BaseAlign.Alphabetic,
    direction: ex.Direction.LeftToRight,
    color: ex.Color.White,
    smoothing: false,
    shadow: {
        blur: 2,
        offset: ex.vec(2, 2),
        color: ex.Color.Black,
    }
})

const loader = new ex.Loader();
for (const res in resources) {
    loader.addResource((resources as any)[res]);
}

export { loader };