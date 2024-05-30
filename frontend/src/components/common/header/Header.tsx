import React, { useState, useEffect } from 'react';
import { List, PersonCircle } from 'react-bootstrap-icons';
import { User } from '../../../models/User';
import UserService from '../../../services/UserService';
import UserInitials from '../../shared/UserInitials';
import { useKeycloak } from '@react-keycloak/web';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => setIsOpen(!isOpen);

    const { keycloak } = useKeycloak();
    const navigate = useNavigate();

    const handleLogout = () => {
        keycloak.logout({
        }).then(() => {
            navigate('/login');
        }).catch((error) => {
            console.error("Logout failed", error);
        });
    };

    let [prevScrollpos, setPrevScrollpos] = useState(window.pageYOffset);
    useEffect(() => {
        window.onscroll = function () {
            var currentScrollPos = window.pageYOffset;
            if (prevScrollpos > currentScrollPos) {
                document.getElementById("hide-header")!.style.top = "0";
            } else {
                document.getElementById("hide-header")!.style.top = "-80px";
            }
            setPrevScrollpos(currentScrollPos);
        }
    }, [prevScrollpos]);

    return (
        <div id='hide-header' className='app-header hide-header'>
            {/* nasty solution, but now the dropdown gets rendered behind the header while still being useable */}
            <div className={`dropdown-container ${isOpen ? 'visible' : ''}`}>
                <a className='border' href='/dashboard'>Dashboard</a>
                <a className='border' href='/availability'>Verfügbarkeit</a>
                <a className='border' href='/profile'>Profil</a>
                <a className='border' onClick={handleLogout}>Abmelden</a>
            </div>

            <div className='app-header'>
                <div className='start'>
                    <img src={process.env.PUBLIC_URL + '/stroodle-logo-white.png'} alt='Logo' className='stroodle-logo' />
                </div>

                <div className='end'>
                    <div className='button-container'>
                        <div className='nav-bar'>
                            <a className='border-hover' href='/dashboard'>Dashboard</a>
                            <a className='border-hover' href='/availability'>Verfügbarkeit</a>
                            <a className='border-hover' href='/profile'>Profil</a>
                            <a className='border-hover' onClick={handleLogout}>Abmelden</a>
                        </div>
                        <button className='profile-button'>
                            <PersonCircle className='icon profile-icon' />
                        </button>
                        <div className='nav-drop-down'>
                            <button className='list-button' onClick={toggleDropdown}>
                                <List className='icon list-icon' />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
