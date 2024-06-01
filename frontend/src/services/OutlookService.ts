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
            const response = await apiClient.get('/ics/save', {
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

    public async submitIcsUrl(icsUrl: string): Promise<boolean> {
        try {
            const response = await apiClient.post(`ics/save`, { url: icsUrl }, {
                headers: {
                    'Authorization': `Bearer ${this.keycloak.token!}`
                }
            });
            return response.data;
        } catch (error) {
            console.error(`Error saving ics url`, error);
            return false;
        }
    }

    public async checkIcsStatus(): Promise<any> {
        try {
            const response = await apiClient.get('/ics/status', {
                headers: {
                    'Authorization': `Bearer ${this.keycloak.token!}`
                }
            });
            return response.data;
        } catch (error: any) {
            console.error('Error checking ics status:', error.response.data);
            throw error;
        }
    }

    public async getIcsEvents(): Promise<any> {
        try {
            const response = await apiClient.get('/ics/events', {
                headers: {
                    'Authorization': `Bearer ${this.keycloak.token!}`
                }
            });
            return response.data;
        } catch (error: any) {
            console.error('Error getting ics event data', error.response.data);
            throw error;
        }
    }
}

export default OutlookService;
