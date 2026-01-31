
import React from 'react';
import './Loader.css';

const Loader = ({ fullScreen = false, text = 'Loading...' }) => {
    return (
        <div className={`loader-container ${fullScreen ? 'full-screen' : ''}`}>
            <div className="spinner"></div>
            {text && <p className="loader-text">{text}</p>}
        </div>
    );
};

export default Loader;
