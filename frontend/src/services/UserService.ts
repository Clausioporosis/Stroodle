import { User, Availability } from '../models/User';
import axios from 'axios';

let loggedInUserMock: User | undefined = {
    id: "6640f9901941ca65dc1399b0",
    firstName: "Max",
    lastName: "Mustermann",
    email: "max.mustermann@example.com",
    availability: {
        MONDAY: [
            {
                start: "08:00:00",
                end: "16:00:00"
            }
        ],
        TUESDAY: [
            {
                start: "09:00:00",
                end: "17:00:00"
            }
        ]
    }
};

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

    async getAvailabilityOfUser(id: string): Promise<Availability | undefined> {
        try {
            const response = await apiClient.get(`/users/${id}/availability`);
            return response.data;
        } catch (error) {
            console.error('Es gab einen Fehler!', error);
        }
    }

    async putAvailabilitByUser(id: string): Promise<Availability | undefined> {
        try {
            const response = await apiClient.put(`/users/${id}/availability`);
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('Es gab einen Fehler!', error);
        }
    }

    // temp logged in user solution until we have a proper login
    async setLoggedInUser(userId: string) {
        try {
            const selectedUser = await this.getUserById(userId);
            loggedInUserMock = selectedUser;
        } catch (error) {
            console.error('Es gab einen Fehler!', error);
        }
    }

    getLoggedInUser(): User | undefined {
        return loggedInUserMock;
    }
}

export default new UserService();