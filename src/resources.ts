import * as ex from 'excalibur';

// import playerSpitesheetFile from '../res/player.png';
// import musicFile from '../res/music.wav';

export const playerSpitesheetFile = require('../res/player.png');
// export const musicFile = '../res/music.wav';


export const resources = {
    player: new ex.ImageSource(playerSpitesheetFile),
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

const loader = new ex.Loader();
for (const res in resources) {
    loader.addResource((resources as any)[res]);
}

export { loader };