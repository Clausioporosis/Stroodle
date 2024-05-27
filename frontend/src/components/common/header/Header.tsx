import React, { useState, useEffect } from 'react';
import { List, PersonCircle } from 'react-bootstrap-icons';

import { User } from '../../../models/User';
import UserService from '../../../services/UserService';
import UserInitials from '../../shared/UserInitials';

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => setIsOpen(!isOpen);


    // temp logged in user solution until we have a proper login
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<User>();

    useEffect(() => {
        const fetchUsers = async () => {
            const users = await UserService.getAllUsers();
            const loggedInUser = UserService.getLoggedInUser();
            setUsers(users);
            setCurrentUser(loggedInUser);
        };

        fetchUsers();
    }, []);

    const handleUserChange = async (userId: string) => {
        await UserService.setLoggedInUser(userId);
        setCurrentUser(UserService.getLoggedInUser());
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
                <a className='border' href='/login'>Abmelden</a>
            </div>

            <div className='app-header'>
                <div className='start'>
                    <img src={process.env.PUBLIC_URL + '/stroodle-logo-white.png'} alt='Logo' className='stroodle-logo' />
                </div>

                <div className='end'>
                    <div className='button-container'>
                        {/*
                            <select value={''} onChange={e => handleUserChange(e.target.value)}>
                                <option value="">{currentUser?.firstName}</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>{user.firstName}</option>
                                ))}
                            </select>
                            */}
                        <div className='nav-bar'>
                            <a className='border-hover' href='/dashboard'>Dashboard</a>
                            <a className='border-hover' href='/availability'>Verfügbarkeit</a>
                            <a className='border-hover' href='/profile'>Profil</a>
                        </div>

                        <button className='profile-button'>
                            <PersonCircle className='icon profile-icon' />

                        </button>
                        <div className='nav-bar'>
                            <a className='border-hover' href='/login'>Abmelden</a>
                        </div>
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
