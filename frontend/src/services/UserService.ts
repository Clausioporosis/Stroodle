import { User, Availability } from '../models/User';
import Keycloak from 'keycloak-js';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

const apiClient: AxiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
});

class UserService {
    private keycloak: Keycloak;

    constructor(keycloak: Keycloak) {
        this.keycloak = keycloak;
    }

    private getAuthHeader(): { Authorization: string } {
        return { 'Authorization': `Bearer ${this.keycloak.token!}` };
    }

    private async handleRequest<T>(request: Promise<AxiosResponse<T>>): Promise<T> {
        try {
            const response = await request;
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data || error.message;
            const statusCode = error.response?.status;

            console.error('API request error:', errorMessage);

            if (statusCode === 404) {
                // interpret 404 as no data found
                return [] as unknown as T;
            }

            throw error;
        }
    }

    public async getAllUsers(): Promise<User[]> {
        const response = await this.handleRequest(apiClient.get('/users', {
            headers: this.getAuthHeader()
        }));
        return response.map((user: User) => new User(
            user.id,
            user.username,
            user.firstName,
            user.lastName,
            user.email
        ));
    }

    public async getUserById(id: string): Promise<User | undefined> {
        const response = await this.handleRequest(apiClient.get(`/users/${id}`, {
            headers: this.getAuthHeader()
        }));
        return new User(
            response.id,
            response.username,
            response.firstName,
            response.lastName,
            response.email
        );
    }

    public async getUserAvailability(userId: string): Promise<Availability | undefined> {
        try {
            const response = await this.handleRequest(apiClient.get(`users/${userId}/availability`, {
                headers: this.getAuthHeader()
            }));
            return response.availability as Availability;
        } catch (error: any) {
            if (error.response?.status === 404) {
                return undefined;
            }
            throw error;
        }
    }

    public async setUserAvailability(availability: Availability, userId: string): Promise<boolean> {
        const response = await this.handleRequest(apiClient.post(`users/${userId}/availability`, { userId, availability }, {
            headers: this.getAuthHeader()
        }));
        return response.status === 200;
    }

    public async searchUsers(query: string): Promise<User[]> {
        const response = await this.handleRequest(apiClient.get(`/users/search`, {
            params: { query },
            headers: this.getAuthHeader()
        }));
        return response.map((user: User) => new User(
            user.id,
            user.username,
            user.firstName,
            user.lastName,
            user.email
        ));
    }

    public async mergeAvailabilities(userIds: string[]): Promise<any> {
        const response = await this.handleRequest(apiClient.post('users/merge', userIds, {
            headers: this.getAuthHeader()
        }));
        return response;
    }
}

export default UserService;
