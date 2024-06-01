import Keycloak from 'keycloak-js';
import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    withCredentials: true // Ensure cookies are sent
});

class OutlookService {
    private keycloak: Keycloak;

    constructor(keycloak: Keycloak) {
        this.keycloak = keycloak;
    }

    public async getAuthLink(): Promise<any> {
        try {
            const response = await apiClient.get('/authenticate/azure', {
                headers: {
                    'Authorization': `Bearer ${this.keycloak.token!}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching auth link:', error);
            throw error;
        }
    }

    public async getOutlookEvents(): Promise<any> {
        try {
            const response = await apiClient.get('/outlook/events', {
                headers: {
                    'Authorization': `Bearer ${this.keycloak.token!}`
                }
            });
            return response.data;
        } catch (error: any) {
            console.error('Error fetching events:', error.response.data);
            throw error;
        }
    }

    public async getUser(): Promise<any> {
        try {
            const response = await apiClient.get('/outlook/profile', {
                headers: {
                    'Authorization': `Bearer ${this.keycloak.token!}`
                }
            });
            return response.data;
        } catch (error: any) {
            console.error('Error fetching user:', error.response.data);
            throw error;
        }
    }
}

export default OutlookService;
