import React, { useState } from 'react';
import UserService from '../../../../services/UserService';
import { Search } from 'react-bootstrap-icons';
import { User } from '../../../../models/User';

interface SearchBarProps {
    onUserClick: (participantId: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onUserClick }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);

    const handleSearchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        if (event.target.value) {
            const results = await UserService.searchUsers(event.target.value);
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    };

    const handleUserClick = (selectedUser: User) => {
        onUserClick(selectedUser.id);
        setSearchTerm('');
    };

    return (
        <div className='search-bar-component'>
            <Search className='search-icon' />
            <input
                className='search-input'
                type="search"
                placeholder="Anhand von Namen oder Email suchen..."
                value={searchTerm}
                onChange={handleSearchChange}
            />
            {searchTerm && (
                <div className='result-list'>
                    {searchResults.length > 0 ? (
                        searchResults.map(user => (
                            <li className='list-item' key={user.id} onClick={() => handleUserClick(user)}>
                                {user.firstName} {user.lastName}
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