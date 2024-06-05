import Keycloak from 'keycloak-js';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

const apiClient: AxiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    withCredentials: true // Ensure cookies are sent
});

class OutlookService {
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
            console.error('API request error:', error.response?.data || error.message);
            throw error;
        }
    }

    public async getAuthLink(): Promise<any> {
        return this.handleRequest(apiClient.get('/authenticate/azure', {
            headers: this.getAuthHeader()
        }));
    }

    public async getOutlookEvents(): Promise<any> {
        return this.handleRequest(apiClient.get('/outlook/events', {
            headers: this.getAuthHeader()
        }));
    }

    public async getUser(): Promise<any> {
        return this.handleRequest(apiClient.get('/ics/save', {
            headers: this.getAuthHeader()
        }));
    }

    public async submitIcsUrl(icsUrl: string): Promise<boolean> {
        try {
            const response = await this.handleRequest(apiClient.post('/ics/save', { url: icsUrl }, {
                headers: this.getAuthHeader()
            }));
            return response;
        } catch (error) {
            console.error('Error saving ics url:', error);
            return false;
        }
    }

    public async checkIcsStatus(): Promise<any> {
        return this.handleRequest(apiClient.get('/ics/status', {
            headers: this.getAuthHeader()
        }));
    }

    public async getIcsEvents(): Promise<any> {
        return this.handleRequest(apiClient.get('/ics/events', {
            headers: this.getAuthHeader()
        }));
    }
}

export default OutlookService;
