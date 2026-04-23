import React, { useState, useRef } from 'react';

import { createStage, checkCollision } from '../utils/gameHelpers';
import { TETROMINOS } from '../utils/tetrominos';

// Custom Hooks
import { useInterval } from '../hooks/useInterval';
import { usePlayer } from '../hooks/usePlayer';
import { useBoard } from '../hooks/useBoard';
import { useGameStatus } from '../hooks/useGameStatus';

// Components
import Stage from './Stage/Stage';
import Display from './Display/Display';
import StartButton from './Controls/StartButton';

const Tetris: React.FC = () => {
    const [dropTime, setDropTime] = useState<number | null>(null);
    const [gameOver, setGameOver] = useState(false);

    const { player, playerRef, updatePlayerPos, resetPlayer, playerRotate, hold, holdPiece, resetHold, switchTetromino } = usePlayer();
    const { stage, setStage, rowsCleared } = useBoard(player, resetPlayer);
    const { score, setScore, rows, setRows, level, setLevel } = useGameStatus(
        rowsCleared
    );

    const lockTimer = useRef<number | null>(null);

    const movePlayer = (dir: number) => {
        // Use Ref for check
        if (!checkCollision(playerRef.current, stage, { x: dir, y: 0 })) {
            updatePlayerPos({ x: dir, y: 0, collided: false });

            // Reset lock timer on move
            if (lockTimer.current) {
                clearTimeout(lockTimer.current);
                lockTimer.current = null;
            }
        }
    };

    const keyUp = ({ keyCode }: { keyCode: number }) => {
        if (!gameOver) {
            // Activate the interval again when user releases down arrow
            if (keyCode === 40) {
                setDropTime(1000 / (level + 1) + 200);
            }
        }
    };

    const startGame = () => {
        // Reset everything
        setStage(createStage());
        setDropTime(1000);
        resetPlayer();
        resetHold();
        setGameOver(false);
        setScore(0);
        setRows(0);
        setLevel(0);
        if (lockTimer.current) {
            clearTimeout(lockTimer.current);
            lockTimer.current = null;
        }
    };

    const drop = () => {
        // Increase level when player has cleared 10 rows
        if (rows > (level + 1) * 10) {
            setLevel(prev => prev + 1);
            // Also increase speed
            setDropTime(1000 / (level + 1) + 200);
        }

        // Use Ref for check
        if (!checkCollision(playerRef.current, stage, { x: 0, y: 1 })) {
            // Falling freely
            if (lockTimer.current) {
                clearTimeout(lockTimer.current);
                lockTimer.current = null;
            }
            updatePlayerPos({ x: 0, y: 1, collided: false });
        } else {
            // Collision imminent - Start Lock Lock Timer
            if (!lockTimer.current) {
                lockTimer.current = window.setTimeout(() => {
                    // Game over check
                    if (playerRef.current.pos.y < 1) {
                        setGameOver(true);
                        setDropTime(null);
                    }
                    updatePlayerPos({ x: 0, y: 0, collided: true });
                    lockTimer.current = null;
                }, 500); // 500ms grace period
            }
        }
    };

    const dropPlayer = () => {
        // We don't want to run the interval when we use the arrow down to
        // move the tetromino downwards. So deactivate it for now.
        setDropTime(null);
        drop();
    };

    // This one starts the game
    // Custom hook by Dan Abramov
    useInterval(() => {
        drop();
    }, dropTime);

    const move = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const { keyCode, shiftKey } = e;
        if (!gameOver) {
            if (keyCode === 37) {
                movePlayer(-1);
            } else if (keyCode === 39) {
                movePlayer(1);
            } else if (keyCode === 40) {
                dropPlayer();
            } else if (keyCode === 38) {
                playerRotate(stage, 1);
                // Reset lock timer on rotation
                if (lockTimer.current) {
                    clearTimeout(lockTimer.current);
                    lockTimer.current = null;
                }
            } else if (keyCode === 67 || keyCode === 16 || shiftKey) { // C or Shift
                holdPiece();
            } else if (keyCode === 32) { // Space
                e.preventDefault();
                switchTetromino(stage);
            } else if (keyCode === 73) { // I
                switchTetromino(stage, 'I');
            } else if (keyCode === 74) { // J
                switchTetromino(stage, 'J');
            } else if (keyCode === 76) { // L
                switchTetromino(stage, 'L');
            } else if (keyCode === 79) { // O
                switchTetromino(stage, 'O');
            } else if (keyCode === 83) { // S
                switchTetromino(stage, 'S');
            } else if (keyCode === 84) { // T
                switchTetromino(stage, 'T');
            } else if (keyCode === 90) { // Z
                switchTetromino(stage, 'Z');
            }
        }
    };

    return (
        <div
            className="tetris-wrapper"
            role="button"
            tabIndex={0}
            onKeyDown={e => move(e)}
            onKeyUp={keyUp}
            style={{
                width: '100vw',
                height: '100vh',
                background: '#0a0a0a',
                overflow: 'hidden',
                outline: 'none',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                paddingTop: '50px',
            }}
        >
            <div
                className="tetris"
                style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    padding: '40px',
                    margin: '0 auto',
                    maxWidth: '900px',
                    width: '100%',
                }}
            >
                <Stage stage={stage} />
                <aside
                    style={{
                        width: '100%',
                        maxWidth: '200px',
                        display: 'block',
                        padding: '0 20px',
                    }}
                >
                    {gameOver ? (
                        <Display gameOver={gameOver} text="Game Over" />
                    ) : (
                        <div>
                            <Display text={`Score: ${score}`} />
                            <Display text={`Rows: ${rows}`} />
                            <Display text={`Level: ${level}`} />

                            <div style={{ marginTop: '20px' }}>
                                <Display text="Hold" />
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    marginTop: '10px',
                                    padding: '10px',
                                    border: '4px solid #333',
                                    borderRadius: '20px',
                                    background: '#000',
                                    minHeight: '80px',
                                    boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                                }}>
                                    { /* Check if hold has a piece (not 0) */}
                                    {hold && hold[0] && hold[0][0] !== '0' && (
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateRows: `repeat(${hold.length}, 15px)`,
                                            gridTemplateColumns: `repeat(${hold[0].length}, 15px)`,
                                            gridGap: '1px',
                                        }}>
                                            {hold.map((row: any[], y: number) =>
                                                row.map((cell: any, x: number) => (
                                                    <div key={`${y}-${x}`} style={{
                                                        width: '15px',
                                                        height: '15px',
                                                        background: cell !== 0 && cell !== '0' ?
                                                            `rgba(${TETROMINOS[cell as keyof typeof TETROMINOS]?.color}, 0.8)` :
                                                            'transparent',
                                                        border: cell !== 0 && cell !== '0' ?
                                                            '1px solid' : 'none',
                                                        borderColor: cell !== 0 && cell !== '0' ?
                                                            `rgba(${TETROMINOS[cell as keyof typeof TETROMINOS]?.color}, 1)` :
                                                            'transparent',
                                                        borderRadius: '2px',
                                                        boxShadow: cell !== 0 && cell !== '0' ?
                                                            `0 0 5px rgba(${TETROMINOS[cell as keyof typeof TETROMINOS]?.color}, 0.5)` : 'none',
                                                    }} />
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    <StartButton callback={startGame} />
                </aside>
            </div>
        </div>
    );
};

export default Tetris;
