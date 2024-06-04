import React, { useState } from 'react';
import UserService from '../../../../services/UserService';
import { Search } from 'react-bootstrap-icons';
import { User } from '../../../../models/User';
import { useKeycloak } from '@react-keycloak/web';


interface SearchBarProps {
    participantsIds: string[];
    onUserClick: (participantId: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onUserClick, participantsIds }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);

    const { keycloak } = useKeycloak();
    const userService = new UserService(keycloak);

    const handleSearchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);

        if (event.target.value) {
            let results = await userService.searchUsers(event.target.value);
            results = results.filter(user => user.id !== keycloak.tokenParsed?.sub!);
            results = results.filter(user => !participantsIds.includes(user.id));
            results.sort((a, b) => {
                const firstNameComparison = a.firstName.localeCompare(b.firstName);
                if (firstNameComparison !== 0) {
                    return firstNameComparison;
                } else {
                    return a.lastName.localeCompare(b.lastName);
                }
            });
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
                                <span className='user'>{user.firstName} {user.lastName}</span> {user.email}
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