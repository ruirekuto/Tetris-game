import React from 'react';
import { TETROMINOS } from '../../utils/tetrominos';

interface Props {
    type: keyof typeof TETROMINOS;
}

const Cell: React.FC<Props> = ({ type }) => (
    <div
        style={{
            width: 'auto',
            background: `rgba(${TETROMINOS[type].color}, 0.8)`,
            border: `${type === '0' ? '0px solid' : '4px solid'}`,
            borderBottomColor: `rgba(${TETROMINOS[type].color}, 0.1)`,
            borderRightColor: `rgba(${TETROMINOS[type].color}, 1)`,
            borderTopColor: `rgba(${TETROMINOS[type].color}, 1)`,
            borderLeftColor: `rgba(${TETROMINOS[type].color}, 0.3)`,
            // Neon Glow effect
            boxShadow: type !== '0' ? `0 0 20px rgba(${TETROMINOS[type].color}, 0.5)` : 'none',
            borderRadius: '4px',
        }}
    />
);

export default React.memo(Cell);
