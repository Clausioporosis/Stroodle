import { User, Availability } from '../models/User';
import Keycloak from 'keycloak-js';
import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
});

class UserService {
    private keycloak: Keycloak;

    constructor(keycloak: Keycloak) {
        this.keycloak = keycloak;
    }

    async getAllUsers(): Promise<User[]> {
        try {
            const response = await apiClient.get('/users', {
                headers: {
                    'Authorization': `Bearer ${this.keycloak.token!}`
                }
            });
            return response.data.map((user: User) => new User(
                user.id,
                user.username,
                user.firstName,
                user.lastName,
                user.email
            ));
        } catch (error) {
            console.error('Error fetching all users', error);
            return [];
        }
    }

    async getUserById(id: string): Promise<User | undefined> {
        try {
            const response = await apiClient.get(`/users/${id}`, {
                headers: {
                    'Authorization': `Bearer ${this.keycloak.token!}`
                }
            });
            return new User(
                response.data.id,
                response.data.username,
                response.data.firstName,
                response.data.lastName,
                response.data.email
            );
        } catch (error) {
            console.error(`Error fetching user with id: ${id}`, error);
        }
    }

    async getUserAvailability(userId: string): Promise<Availability | undefined> {
        try {
            const response = await apiClient.get(`users/${userId}/availability`, {
                headers: {
                    'Authorization': `Bearer ${this.keycloak.token!}`
                }
            });
            return response.data.availability as Availability;
        } catch (error) {
            console.error(`Error fetching availability of user with id: ${userId}`, error);
        }
    }

    async setUserAvailability(availability: Availability, userId: string) {
        try {
            const response = await apiClient.post(`users/${userId}/availability`, { userId, availability }, {
                headers: {
                    'Authorization': `Bearer ${this.keycloak.token!}`
                }
            });
            return response.status === 200;
        } catch (error) {
            console.error(`Error setting availability of user with id: ${userId}`, error);
        }
    }

    // email search not working, check backend
    async searchUsers(query: string): Promise<User[]> {
        try {
            const response = await apiClient.get(`/users/search`, {
                params: {
                    query: query
                },
                headers: {
                    'Authorization': `Bearer ${this.keycloak.token!}`
                }
            });
            return response.data.map((user: User) => new User(
                user.id,
                user.username,
                user.firstName,
                user.lastName,
                user.email
            ));
        } catch (error) {
            console.error(`Error searching users with query: ${query}`, error);
            return [];
        }
    }
}

export default UserService;