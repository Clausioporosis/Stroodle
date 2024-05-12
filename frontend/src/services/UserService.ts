import { get } from 'http';
import { User, Availability } from '../models/User';
import axios from 'axios';

let loggedInUserMock: User | undefined;

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

    async getAvailabilityOfUser(id: string): Promise<Availability> {
        try {
            const response = await apiClient.get(`/users//${id}/availability`);
            return response.data;
        } catch (error) {
            console.error('Es gab einen Fehler!', error);
            throw error; // Fehler weiterwerfen
        }
    }

    async putAvailabilityById(id: string): Promise<Availability> {
        try {
            const response = await apiClient.put(`/users//${id}/availability`);
            return response.data;
        } catch (error) {
            console.error('Es gab einen Fehler!', error);
            throw error; // Fehler weiterwerfen
        }
    }

    // temp logged in user solution until we have a proper login
    async setLoggedInUser(userId: string) {
        try {
            loggedInUserMock = await this.getUserById(userId);
        } catch (error) {
            console.error('Es gab einen Fehler!', error);
        }
        console.log('User changed to:', loggedInUserMock);
    }

    getLoggedInUser(): User | undefined {
        return loggedInUserMock;
    }
}

export default new UserService();