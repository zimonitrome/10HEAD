import * as ex from 'excalibur';

export const playerSpitesheetFile = require('./res/player_gray.png');
export const playerBlankSpitesheetFile = require('./res/player_empty_gray.png');
export const playerDetailsSpitesheetFile = require('./res/player_details.png');
export const corpseFile = require('./res/corpse.png');
export const numbersFile = require('./res/numbers.png');
export const edgeTileFile = require('./res/edgetile.png');
export const backgroundFile = require('./res/background.png');
export const fontFile = require('./res/debug-font.png');
export const titleFile = require('./res/logo.png');
export const instructionsFile = require('./res/instructions.png');
// const font2 = require('./res/upheavtt.ttf');
const font2 = require('./res/Mister October.ttf');
console.log("aa");
console.log(font2);
console.log("bb");
export const musicFile = require('./res/music.wav');


export const resources = {
    player: new ex.ImageSource(playerSpitesheetFile),
    playerBlank: new ex.ImageSource(playerBlankSpitesheetFile),
    playerDetails: new ex.ImageSource(playerDetailsSpitesheetFile),
    corpse: new ex.ImageSource(corpseFile),
    numbers: new ex.ImageSource(numbersFile),
    edgeTile: new ex.ImageSource(edgeTileFile),
    font: new ex.ImageSource(fontFile),
    background: new ex.ImageSource(backgroundFile),
    title: new ex.ImageSource(titleFile),
    instructions: new ex.ImageSource(instructionsFile),
    music: new ex.Sound(musicFile),
}


export const playerSpitesheet = ex.SpriteSheet.fromImageSource({
    image: resources.player,
    grid: {
        rows: 5,
        columns: 3,
        spriteWidth: 24,
        spriteHeight: 20
    }
});

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

const fontSpriteSheet = ex.SpriteSheet.fromImageSource({
    image: resources.font,
    grid: {
        rows: 3,
        columns: 16,
        spriteWidth: 16,
        spriteHeight: 16,
    },
})

export const spriteFont = new ex.SpriteFont({
    alphabet: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ,!\'&."?-()+ ',
    caseInsensitive: true,
    spriteSheet: fontSpriteSheet,
    spacing: -6,
})

export const edgeTileSprite = resources.edgeTile.toSprite();

export const backgroundSprite = resources.background.toSprite();

export const titleSprite = resources.title.toSprite();

export const instructionsSprite = resources.instructions.toSprite();

export const defaultFont = new ex.Font({
    size: 30,
    unit: ex.FontUnit.Px,
    // family: 'sans-serif',
    // family: 'upheaval',
    // family: 'Upheaval',
    // family: 'Mister October',
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