import React, { useState } from 'react';
import './Header.css';
import { List, PersonCircle } from 'react-bootstrap-icons';

const Header: React.FC = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <header className="header-container">
            <img src="./stroodle-logo-white.png" alt="Logo" className="logo" />
            <div className="right-section">
                <div className="page-links">
                    <a href="/dashboard">Dashboard</a>
                </div>
                <div className="profile-icon"><PersonCircle /></div>
                <button className="dropdown-button" onClick={toggleDropdown}><List /></button>
                <div className={`dropdown-menu ${dropdownOpen ? 'dropdown-open' : ''}`}>
                    <a href="/profile">Verfügbarkeit</a>
                    <a href="/profile">Profil</a>
                    <a href="/settings">Einstellungen</a>
                    <a href="/logout">Abmelden</a>
                </div>
            </div>
        </header>
    );
};

export default Header;
