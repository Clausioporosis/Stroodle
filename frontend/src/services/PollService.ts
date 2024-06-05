import { Poll } from '../models/Poll';
import Keycloak from 'keycloak-js';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

const apiClient: AxiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
});

class PollService {
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

    public async createPoll(poll: Poll): Promise<Poll> {
        return this.handleRequest(apiClient.post('/polls', poll, {
            headers: this.getAuthHeader()
        }));
    }

    public async getAllPolls(): Promise<Poll[]> {
        return this.handleRequest(apiClient.get('/polls', {
            headers: this.getAuthHeader()
        }));
    }

    public async getPollById(id: string): Promise<Poll | undefined> {
        return this.handleRequest(apiClient.get(`/polls/search/${id}`, {
            headers: this.getAuthHeader()
        }));
    }

    public async putPoll(id: string, poll: Poll): Promise<Poll> {
        return this.handleRequest(apiClient.put<Poll>(`/polls/${id}`, poll, {
            headers: this.getAuthHeader()
        }));
    }

    public async deletePollById(id: string): Promise<void> {
        await this.handleRequest(apiClient.delete(`/polls/${id}`, {
            headers: this.getAuthHeader()
        }));
    }

    public async getMyPolls(): Promise<Poll[]> {
        return this.handleRequest(apiClient.get(`/polls/me`, {
            headers: this.getAuthHeader()
        }));
    }

    public async getInvitedPolls(): Promise<Poll[]> {
        return this.handleRequest(apiClient.get(`/polls/me/invitations`, {
            headers: this.getAuthHeader()
        }));
    }
}

export default PollService;
