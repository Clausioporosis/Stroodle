import React, { useState, useEffect } from 'react';
import { List, PersonCircle } from 'react-bootstrap-icons';

import { User } from '../../../models/User';
import UserService from '../../../services/UserService';

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => setIsOpen(!isOpen);


    // temp logged in user solution until we have a proper login
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const users = await UserService.getAllUsers();
            setUsers(users);
        };

        fetchUsers();
    }, []);

    const handleUserChange = (user: User) => {
        UserService.setLoggedInUser(user);
    };

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

                        <select>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>{user.firstName} {user.lastName}</option>
                            ))}
                        </select>

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
