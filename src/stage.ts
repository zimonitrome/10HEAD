import * as ex from "excalibur";

export const getStage = (engine: ex.Engine, width: number, height: number) => {
    height += 2;
    width += 2;

    const blockSize = 50;
    const bricks: ex.Actor[] = [];

    const padding = 1;
    const fullWidth = (width * blockSize) + ((width - 1) * padding);
    const fullHeight = (height * blockSize) + ((height - 1) * padding);
    
    const xoffset = engine.drawWidth / 2 - fullWidth / 2 + blockSize / 2;
    const yoffset = engine.drawHeight / 2 - fullHeight / 2 + blockSize / 2;

    for (let j = 0; j < height; j++) {
        for (let i = 0; i < width; i++) {

            if (i != 0 && i != (width - 1) && j != 0 && j != (height - 1))
            {
                continue;
            }

            bricks.push(
                new ex.Actor({
                    x: xoffset + i * (blockSize + padding) + padding,
                    y: yoffset + j * (blockSize + padding) + padding,
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

    return bricks;
};
