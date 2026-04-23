import { useState, useCallback, useRef } from 'react';
import { TETROMINOS, randomTetromino, type TetrominoShape } from '../utils/tetrominos';
import { checkCollision, STAGE_WIDTH } from '../utils/gameHelpers';

export const usePlayer = () => {
    const [player, setPlayer] = useState({
        pos: { x: 0, y: 0 },
        tetromino: TETROMINOS[0].shape,
        collided: false,
    });

    const [hold, setHold] = useState<any[]>(TETROMINOS[0].shape);
    const [canHold, setCanHold] = useState(true);

    // Use a ref to track player state immediately for collision detection
    const playerRef = useRef({
        pos: { x: 0, y: 0 },
        tetromino: TETROMINOS[0].shape,
        collided: false,
    });

    const rotate = (matrix: any, dir: number) => {
        // Make the rows to become cols (transpose)
        const rotatedTetro = matrix.map((_: any, index: number) =>
            matrix.map((col: any) => col[index])
        );
        // Reverse each row to get a rotated matrix
        if (dir > 0) return rotatedTetro.map((row: any) => row.reverse());
        return rotatedTetro.reverse();
    };

    const playerRotate = (stage: any, dir: number) => {
        const clonedPlayer = JSON.parse(JSON.stringify(playerRef.current));
        clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, dir);

        const pos = clonedPlayer.pos.x;
        let offset = 1;
        while (checkCollision(clonedPlayer, stage, { x: 0, y: 0 })) {
            clonedPlayer.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset > clonedPlayer.tetromino[0].length) {
                rotate(clonedPlayer.tetromino, -dir);
                clonedPlayer.pos.x = pos;
                return;
            }
        }

        playerRef.current = clonedPlayer;
        setPlayer(clonedPlayer);
    };

    const updatePlayerPos = ({ x, y, collided }: { x: number; y: number; collided: boolean }) => {
        playerRef.current = {
            ...playerRef.current,
            pos: { x: (playerRef.current.pos.x += x), y: (playerRef.current.pos.y += y) },
            collided,
        };

        setPlayer({ ...playerRef.current });
    };

    const resetPlayer = useCallback(() => {
        const newPlayer = {
            pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
            tetromino: randomTetromino().shape,
            collided: false,
        };

        playerRef.current = newPlayer;
        setPlayer(newPlayer);
        setCanHold(true);
    }, []);

    const holdPiece = () => {
        if (!canHold) return;

        // Get the key of the current tetromino to find its default shape (unrotated)
        // We can iterate TETROMINOS to match the current shape logic, 
        // but simpler to just store the type string if we tracked it.
        // Since we don't track type explicitly in state, we might have issues with rotation reset.
        // For now, let's assume we hold the CURRENT shape or we need to find the type.
        // BETTER FIX: Add 'type' to player state.

        // Quick fix: Determine type from shape
        let currentType: TetrominoShape | undefined;

        // Heuristic: Check if shape includes a specific string char
        // All our shapes have 'I', 'J', 'L' etc in them.
        for (let y = 0; y < playerRef.current.tetromino.length; y++) {
            for (let x = 0; x < playerRef.current.tetromino[y].length; x++) {
                const cell = playerRef.current.tetromino[y][x];
                if (typeof cell === 'string' && cell !== '0') {
                    currentType = cell as TetrominoShape;
                    break;
                }
            }
            if (currentType) break;
        }

        if (!currentType) return;

        const newHoldPiece = TETROMINOS[currentType].shape;

        // logic:
        // 1. If hold is empty (0), put current in hold, spawn new.
        // 2. If hold has piece, swap.

        // Check if hold is empty (first cell is '0')
        const isHoldEmpty = hold[0][0] === '0';

        if (isHoldEmpty) {
            setHold(newHoldPiece);
            resetPlayer(); // This spawns new
        } else {
            // Swap
            const pieceFromHold = hold;
            setHold(newHoldPiece);

            const newPlayer = {
                pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
                tetromino: pieceFromHold,
                collided: false,
            };
            playerRef.current = newPlayer;
            setPlayer(newPlayer);
        }
        setCanHold(false);
    };

    const resetHold = () => {
        setHold(TETROMINOS[0].shape);
    };

    const switchTetromino = (stage: any, specificShape?: TetrominoShape) => {
        const newTetromino = specificShape ? TETROMINOS[specificShape].shape : randomTetromino().shape;

        const clonedPlayer = JSON.parse(JSON.stringify(playerRef.current));
        clonedPlayer.tetromino = newTetromino;

        // Only update if no collision
        if (!checkCollision(clonedPlayer, stage, { x: 0, y: 0 })) {
            playerRef.current = clonedPlayer;
            setPlayer(clonedPlayer);
        }
    };

    return { player, playerRef, updatePlayerPos, resetPlayer, playerRotate, hold, holdPiece, resetHold, switchTetromino };
};
