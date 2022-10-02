import * as ex from "excalibur";

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

    for (let j = 0; j < height; j++) {
        for (let i = 0; i < width; i++) {

            if (i != 0 && i != (width - 1) && j != 0 && j != (height - 1)) {
                continue;
            }

            bricks.push(
                new ex.Actor({
                    name: "brick",
                    x: xoffset + i * (blockSize + padding) + padding - blockSize/2,
                    y: yoffset + j * (blockSize + padding) + padding - blockSize/2,
                    width: blockSize,
                    height: blockSize,
                    color: ex.Color.fromRGB(
                        127,
                        Math.round(255 * (j / height)),
                        Math.round(255 * (i / width)),
                        1
                    )
                })
            );
        }
    }

    bricks.forEach(brick => {
        brick.body.collisionType = ex.CollisionType.Fixed;

        engine.add(brick);
    });

    const fakeStage = new ex.Actor({
        name: "stage",
        width: fullWidth,
        height: fullHeight,
        x: (fullWidth) / 2 - blockSize,
        y: (fullHeight) / 2 - blockSize,
        color: new ex.Color(0, 0, 0, 1),
        z: -10
    });

    engine.add(fakeStage);

    engine.currentScene.camera.strategy.lockToActor(fakeStage);
};
