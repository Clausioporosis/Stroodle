import { Poll } from '../models/Poll';
import Keycloak from 'keycloak-js';

import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
});

class PollService {
    private keycloak: Keycloak;

    constructor(keycloak: Keycloak) {
        this.keycloak = keycloak;
    }

    async createPoll(poll: Poll): Promise<Poll> {
        try {
            const response = await apiClient.post('/polls', poll, {
                headers: {
                    'Authorization': `Bearer ${this.keycloak.token!}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating poll!', error);
            return poll;
        }
    }

    async getAllPolls(): Promise<Poll[]> {
        try {
            const response = await apiClient.get('/polls', {
                headers: {
                    'Authorization': `Bearer ${this.keycloak.token!}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error getting poll!', error);
            return [];
        }
    }

    async getPollById(id: string): Promise<Poll | undefined> {
        try {
            const response = await apiClient.get(`/polls/search/${id}`, {
                headers: {
                    'Authorization': `Bearer ${this.keycloak.token!}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Es gab einen Fehler!', error);
        }
    }

    async putPoll(id: string, poll: Poll): Promise<Poll> {
        try {
            const response = await apiClient.put<Poll>(`/polls/${id}`, poll, {
                headers: {
                    'Authorization': `Bearer ${this.keycloak.token!}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error putting poll', error);
            throw new Error(`Error putting poll`);
        }
    }

    async deletePollById(id: string): Promise<void> {
        try {
            await apiClient.delete(`/polls/${id}`, {
                headers: {
                    'Authorization': `Bearer ${this.keycloak.token!}`
                }
            });
        } catch (error) {
            console.error('Es gab einen Fehler beim Löschen des Polls!', error);
        }
    }

    async getMyPolls(): Promise<Poll[]> {
        try {
            const response = await apiClient.get(`/polls/me`, {
                headers: {
                    'Authorization': `Bearer ${this.keycloak.token!}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Es gab einen Fehler!', error);
            return [];
        }
    }

    async getInvitedPolls(): Promise<Poll[]> {
        try {
            const response = await apiClient.get(`/polls/me/invitations`, {
                headers: {
                    'Authorization': `Bearer ${this.keycloak.token!}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Es gab einen Fehler!', error);
            return [];
        }
    }
}

export default PollService;