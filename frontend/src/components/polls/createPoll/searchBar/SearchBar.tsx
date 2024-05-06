import React, { useState } from 'react';
import UserService from '../../../../services/UserService';
import { User } from '../../../../models/User';
import './SearchBar.css';

interface SearchBarProps {
    onUserClick: (user: User) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onUserClick }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        if (event.target.value) {
            const results = UserService.searchUsers(event.target.value);
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    };

    const handleUserClick = (selectedUser: User) => {
        onUserClick(selectedUser);
        setSearchTerm('');
    };

    return (
        <div className='body'>
            <input
                className='search-input'
                type="search"
                placeholder="Suche nach Benutzern..."
                value={searchTerm}
                onChange={handleSearchChange}
            />
            {searchTerm && (
                <div className='list-container'>
                    {searchResults.length > 0 ? (
                        searchResults.map(user => (
                            <li className='list-item' key={user.id} onClick={() => handleUserClick(user)}>
                                {user.firstname} {user.lastname}
                            </li>
                        ))
                    ) : (
                        <li className='list-item-error'>Keine Benutzer gefunden...</li>
                    )}
                </div>
            )}
        </div>
    );
}

export default SearchBar;