import * as ex from "excalibur";
import { backgroundSprite, edgeTileSprite } from "./resources";

const newTile = (i: number, j: number, blockSize: number, color = ex.Color.Transparent) => new ex.Actor({
    name: "brick",
    x: i * (blockSize) - blockSize / 2,
    y: j * (blockSize) - blockSize / 2,
    width: blockSize,
    height: blockSize,
    color: color
})

export const getStage = (engine: ex.Engine, width: number, height: number) => {
    height += 2;
    width += 2;

    const blockSize = 50;
    const bricks: ex.Actor[] = [];

    const padding = 0;
    const fullWidth = (width * blockSize) + (width * padding);
    const fullHeight = (height * blockSize) + (height * padding);

    const xoffset = 0; //engine.drawWidth / 2 - fullWidth / 2 + blockSize / 2;
    const yoffset = 0; //engine.drawHeight / 2 - fullHeight / 2 + blockSize / 2;

    let scaleVec = ex.vec(50 / 16, 50 / 16);

    let spriteTop = edgeTileSprite.clone();
    spriteTop.scale = scaleVec;

    let spriteBottom = edgeTileSprite.clone();
    spriteBottom.origin = ex.vec(10, 10)
    spriteBottom.rotation = ex.TwoPI / 2;
    spriteBottom.scale = scaleVec;

    let spriteLeft = edgeTileSprite.clone();
    spriteLeft.origin = ex.vec(10, 10)
    spriteLeft.rotation = - ex.TwoPI / 4;
    spriteLeft.scale = scaleVec;

    let spriteRight = edgeTileSprite.clone();
    spriteRight.origin = ex.vec(10, 10)
    spriteRight.rotation = ex.TwoPI / 4;
    spriteRight.scale = scaleVec;

    for (let j = 1; j < height - 1; j++) {
        let tile = newTile(0, j, blockSize);
        tile.graphics.add(spriteLeft);

        let tile2 = newTile(width - 1, j, blockSize);
        tile2.graphics.add(spriteRight);

        bricks.push(tile, tile2);
    }

    for (let i = 1; i < height - 1; i++) {
        let tile = newTile(i, 0, blockSize);
        tile.graphics.add(spriteTop);

        let tile2 = newTile(i, height - 1, blockSize);
        tile2.graphics.add(spriteBottom);

        bricks.push(tile, tile2);
    }

    // Corner things
    const edgeColor = ex.Color.fromHex("#3ab643");
    [[0, 0], [0, height-1], [width-1, 0], [width-1, height-1]].forEach(([i, j]) => {
        let tile = newTile(i, j, blockSize, edgeColor);
        bricks.push(tile);
    });

    bricks.forEach(brick => {
        brick.body.collisionType = ex.CollisionType.Fixed;

        engine.add(brick);
    });

    const backgroundStage = new ex.Actor({
        name: "stage",
        width: fullWidth,
        height: fullHeight,
        x: (fullWidth) / 2 - blockSize,
        y: (fullHeight) / 2 - blockSize,
        z: -10
    });

    backgroundSprite.scale = scaleVec;
    backgroundStage.graphics.add(backgroundSprite);

    engine.add(backgroundStage);

    return backgroundStage;
};
