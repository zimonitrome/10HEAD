import * as ex from 'excalibur';

export const playerSpitesheetFile = require('./res/player_gray.png');
export const corpseFile = require('./res/corpse.png');
// export const musicFile = '../res/music.wav';


export const resources = {
    player: new ex.ImageSource(playerSpitesheetFile),
    corpse: new ex.ImageSource(corpseFile),
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

export const corpseSprite = resources.corpse.toSprite();

const loader = new ex.Loader();
for (const res in resources) {
    loader.addResource((resources as any)[res]);
}

export { loader };