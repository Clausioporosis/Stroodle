import { User } from '../models/User';
import axios from 'axios';

let loggedInUserMock = new User('', '', '', '', {});

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api',
});

class UserService {
    async getAllUsers(): Promise<User[]> {
        try {
            const response = await apiClient.get('/users');
            return response.data;
        } catch (error) {
            console.error('Es gab einen Fehler!', error);
            return [];
        }
    }

    async searchUsers(query: string): Promise<User[]> {
        try {
            const response = await apiClient.get(`/users/search/query`, {
                params: {
                    query: query
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

    setLoggedInUser = (user: User) => {
        loggedInUserMock = user;
    }
}

export default new UserService();