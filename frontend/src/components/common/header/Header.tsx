import React, { useState } from 'react';
import { List, PersonCircle } from 'react-bootstrap-icons';

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => setIsOpen(!isOpen);

    return (
        <div className='app-header'>
            {/* nasty solution, but now the dropdown gets rendered behind the header while still being useable */}
            <div className={`dropdown-container ${isOpen ? 'visible' : ''}`}>
                <a href='/dashboard'>Dashboard</a>
                <a href='/availability'>Verfügbarkeit</a>
                <a href='/profile'>Profil</a>
                <a href='/login'>Abmelden</a>
            </div>

            <div className='app-header'>
                <div className='start'>
                    <img src={process.env.PUBLIC_URL + '/stroodle-logo-white.png'} alt='Logo' className='stroodle-logo' />
                </div>

                <div className='end'>
                    <div className='button-container'>
                        <button className='profile-button'>
                            <PersonCircle className='icon profile-icon' />
                        </button>
                        <button className='list-button' onClick={toggleDropdown}>
                            <List className='icon list-icon' />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
