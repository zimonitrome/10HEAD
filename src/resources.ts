import * as ex from 'excalibur';

export const playerSpitesheetFile = require('./res/player_gray.png');
export const playerBlankSpitesheetFile = require('./res/player_empty_gray.png');
export const playerDetailsSpitesheetFile = require('./res/player_details.png');
export const corpseFile = require('./res/corpse.png');
export const numbersFile = require('./res/numbers.png');
// export const musicFile = '../res/music.wav';


export const resources = {
    player: new ex.ImageSource(playerSpitesheetFile),
    playerBlank: new ex.ImageSource(playerBlankSpitesheetFile),
    playerDetails: new ex.ImageSource(playerDetailsSpitesheetFile),
    corpse: new ex.ImageSource(corpseFile),
    numbers: new ex.ImageSource(numbersFile),
    // music: new ex.Sound(musicFile),
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

const loader = new ex.Loader();
for (const res in resources) {
    loader.addResource((resources as any)[res]);
}

export { loader };