import { User, Availability } from '../models/User';
import axios from 'axios';

export let loggedInUserMock: User = {
    id: "1",
    firstName: "Clausio",
    lastName: "Porosis",
    email: "clausioporosis@example.com",
    availability: {
        "MONDAY": [
            {
                "start": "09:00",
                "end": "17:00"
            }
        ],
        "TUESDAY": [
            {
                "start": "09:00",
                "end": "12:00"
            },
            {
                "start": "14:00",
                "end": "22:00"
            }
        ]
    }
};

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api',
});

class UserService {
    constructor() {
        (async () => {
            this.createUser(loggedInUserMock);
        })();
    }

    async createUser(user: User): Promise<User> {
        try {
            const response = await apiClient.post<User>('/users', user);
            return response.data;
        } catch (error) {
            console.error('Error creating User', error);
            //throw new Error(`Error creating User`);
            return user;
        }
    }

    async getAllUsers(): Promise<User[]> {
        try {
            const response = await apiClient.get<User[]>(`/users`);
            return response.data;
        } catch (error) {
            console.error('Error fetching all User', error);
            //throw new Error(`Error fetching all User`);
            return [];
        }
    }

    async getUserById(id: string): Promise<User> {
        try {
            const response = await apiClient.get<User>(`/users/search/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching User by ID', error);
            throw new Error(`Error fetching User by ID: ${id}`);
        }
    }

    async getAvailabilityOfUser(id: string): Promise<Availability> {
        try {
            const response = await apiClient.get<Availability>(`/users/${id}/availability`);
            return response.data;
        } catch (error) {
            console.error('Error fetching availability', error);
            throw new Error(`Error fetching availability of User with ID: ${id}`);
        }
    }

    async putAvailabilitByUser(id: string, availability: Availability): Promise<Availability> {
        try {
            const response = await apiClient.put<Availability>(`/users/${id}/availability`, availability);
            return response.data;
        } catch (error) {
            console.error('Error fetchputtinging availability of User', error);
            throw new Error(`Error putting availability of User with ID: ${id}`);
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


    // temp logged in user solution until we have a proper login
    async setLoggedInUser(userId: string) {
        try {
            const selectedUser = await this.getUserById(userId);
            loggedInUserMock = selectedUser;
        } catch (error) {
            console.error('Es gab einen Fehler!', error);
        }
    }

    getLoggedInUser(): User {
        return loggedInUserMock;
    }
}

export default new UserService();