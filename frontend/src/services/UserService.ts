import { User } from '../models/User';
import { mockUsers } from '../tests/MockData';

import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api',
});


class UserService {

    constructor() {

        (async () => {
            const allUsers = await this.getAllUsers()
            console.log("All users: ", allUsers);
        })();

        (async () => {
            const searchedUsers = await this.getUserById('663a308bd8fec05872a94352')
            console.log("Searched users: ", searchedUsers);
        })();
    }

    async getAllUsers(): Promise<User[]> {
        try {
            const response = await apiClient.get('/users');
            return response.data;
        } catch (error) {
            console.error('Es gab einen Fehler!', error);
            return [];
        }
    }

    async searchUsers(searchTerm: string): Promise<User[]> {
        try {
            const response = await apiClient.get('/users/search', {
                params: {
                    searchTerm: searchTerm
                }
            });
            return response.data;
        } catch (error) {
            console.error('Es gab einen Fehler!', error);
            return [];
        }
    }

    async getUserById(id: string): Promise<User | undefined> {
        try {
            const response = await apiClient.get(`/users/search/${id}`);
            return response.data;
        } catch (error) {
            console.error('Es gab einen Fehler!', error);
        }
    }


}

export default new UserService();