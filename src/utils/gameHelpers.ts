export const STAGE_WIDTH = 12;
export const STAGE_HEIGHT = 20;

export type CellData = [string | number, string]; // [type, state]
export type StageData = CellData[][];

export const createStage = (): StageData =>
    Array.from(Array(STAGE_HEIGHT), () =>
        new Array(STAGE_WIDTH).fill(['0', 'clear'])
    );

export const checkCollision = (
    player: any,
    stage: StageData,
    { x: moveX, y: moveY }: { x: number; y: number }
) => {
    for (let y = 0; y < player.tetromino.length; y += 1) {
        for (let x = 0; x < player.tetromino[y].length; x += 1) {
            // 1. Check that we're on an actual Tetromino cell
            if (player.tetromino[y][x] !== 0 && player.tetromino[y][x] !== '0') {
                const targetY = y + player.pos.y + moveY;
                const targetX = x + player.pos.x + moveX;

                // 2. Check that our move is inside the game areas height (y)
                // We shouldn't go through the bottom of the play area
                if (targetY >= STAGE_HEIGHT || targetY < 0) {
                    return true;
                }

                // 3. Check that our move is inside the game areas width (x)
                if (targetX < 0 || targetX >= STAGE_WIDTH) {
                    return true;
                }

                // 4. Check that the cell we're moving to isn't set to clear
                // If it is inside bounds, we can safely access it
                if (stage[targetY][targetX][1] !== 'clear') {
                    return true;
                }
            }
        }
    }
    return false;
};
