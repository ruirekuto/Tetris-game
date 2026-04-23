import React from 'react';

interface Props {
    callback: () => void;
}

const StartButton: React.FC<Props> = ({ callback }) => (
    <button
        onClick={callback}
        style={{
            boxSizing: 'border-box',
            margin: '0 0 20px 0',
            padding: '20px',
            minHeight: '30px',
            width: '100%',
            borderRadius: '20px',
            border: 'none',
            color: 'white',
            background: '#333',
            fontFamily: 'Pixel, Arial, Helvetica, sans-serif',
            fontSize: '1rem',
            outline: 'none',
            cursor: 'pointer',
            boxShadow: '0 0 10px rgba(0,0,0,0.5)',
            transition: 'all 0.3s ease',
        }}
        onMouseOver={(e) => (e.currentTarget.style.background = '#444')}
        onMouseOut={(e) => (e.currentTarget.style.background = '#333')}
    >
        Start Game
    </button>
);

export default StartButton;
