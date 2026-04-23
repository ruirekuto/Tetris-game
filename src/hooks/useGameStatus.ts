import { useState, useEffect } from 'react';

export const useGameStatus = (rowsCleared: number) => {
    const [score, setScore] = useState(0);
    const [rows, setRows] = useState(0);
    const [level, setLevel] = useState(0);

    useEffect(() => {
        const calcScore = () => {
            // Standard Tetris scoring (Nintendo)
            const linePoints = [40, 100, 300, 1200];

            // We have score
            if (rowsCleared > 0) {
                // This is how it is calculated
                setScore(prev => prev + linePoints[rowsCleared - 1] * (level + 1));
                setRows(prev => prev + rowsCleared);
                setLevel(prev => prev + 1);
            }
        };

        calcScore();
    }, [rowsCleared, level]);

    return { score, setScore, rows, setRows, level, setLevel };
};
