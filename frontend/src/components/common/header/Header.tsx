import React, { useState } from 'react';
import { List, PersonCircle } from 'react-bootstrap-icons';

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => setIsOpen(!isOpen);

    return (
        <header className='app-header'>

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
                {isOpen && (
                    <div className='dropdown-container'>
                        <a href='/dashboard'>Dashboard</a>
                        <a href='/availability'>Verfügbarkeit</a>
                        <a href='/profile'>Profil</a>
                        <a href='/login'>Abmelden</a>
                    </div>
                )}

            </div>


        </header>
    );
};

export default Header;
