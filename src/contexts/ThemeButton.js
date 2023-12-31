import React from 'react';
import DarkIcon from '../assets/icons8-moon-48.png';
import LightIcon from '../assets/icons8-sun-48.png';

const ThemeButton = ({ onClick, flipped }) => {
    return (
        <button
            onClick={onClick}
            className="theme-switch-button"
        >
            <div className={`icon-container ${flipped ? "flipped" : ""}`}>
                <img
                    src={DarkIcon}
                    alt="Dark theme"
                    className="moon-icon"
                />
                <img
                    src={LightIcon}
                    alt="Light theme"
                    className="sun-icon"
                />
            </div>
        </button>
    )
}

export default ThemeButton;
