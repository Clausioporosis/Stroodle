import { User, Availability } from '../models/User';
import axios from 'axios';



export let loggedInUserMock: User = {
    id: "1",
    username: "clausi",
    firstName: "Clausio",
    lastName: "Porosis",
    email: "clausioporosis@example.com"
};

const apiClient = axios.create({
    baseURL: 'http://localhost:8081/api',
});

class UserService {
    constructor() {
        (async () => {

        })();
    }

    async getAllUsersTest(token: string): Promise<User[]> {
        try {
            const response = await apiClient.get('/users', {
                headers: {
                    'Authorization': `Bearer ${token}`
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

    async getUserAvailabilityTest(userId: string, token: string): Promise<Availability | undefined> {
        try {
            const response = await apiClient.get(`users/${userId}/availability`, {
                headers: {
                    'Authorization': `Bearer ${token}`
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
            console.error(`Error fetching availability of user with id: ${userId}`, error);
        }
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

    async putAvailabilitByUser(availability: Availability): Promise<Availability> {
        try {
            const response = await apiClient.put<Availability>(`/users/${loggedInUserMock.id}/availability`, availability);
            return response.data;
        } catch (error) {
            console.error('Error putting availability of current User', error);
            throw new Error(`Error putting availability of current User`);
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