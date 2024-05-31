import Keycloak from 'keycloak-js';
import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
});

class OutlookService {
    private keycloak: Keycloak;

    constructor(keycloak: Keycloak) {
        this.keycloak = keycloak;
    }

    public async getAuthLink(): Promise<any> {
        try {
            const response = await apiClient.get('/auth/link', {
                headers: {
                    'Authorization': `Bearer ${this.keycloak.token!}`
                }
            });
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching auth link:', error);
            throw error;
        }
    }
}

export default OutlookService;
