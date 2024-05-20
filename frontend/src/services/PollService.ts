import { Poll } from '../models/Poll';

import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api',
});

class PollService {
    constructor() {
        (async () => {
            //const searchedPoll = await this.getPollById('')
            //console.log("Searched poll: ", searchedPoll);
        })();
    }

    async createPoll(poll: Poll): Promise<Poll> {
        try {
            const response = await apiClient.post('/polls', poll);
            return response.data;
        } catch (error) {
            console.error('Es gab einen Fehler!', error);
            return poll;
        }
    }

    async getAllPolls(): Promise<Poll[]> {
        try {
            const response = await apiClient.get('/polls');
            return response.data;
        } catch (error) {
            console.error('Es gab einen Fehler!', error);
            return [];
        }
    }

    async getPollById(id: string): Promise<Poll | undefined> {
        try {
            const response = await apiClient.get(`/polls/search/${id}`);
            return response.data;
        } catch (error) {
            console.error('Es gab einen Fehler!', error);
        }
    }

    async putPoll(poll: Poll): Promise<Poll> {
        try {
            const response = await apiClient.put<Poll>(`/polls/${poll.id}`, poll);
            return response.data;
        } catch (error) {
            console.error('Error putting poll', error);
            throw new Error(`Error putting poll`);
        }
    }

    async deletePollById(id: string): Promise<void> {
        try {
            await apiClient.delete(`/polls/${id}`);
        } catch (error) {
            console.error('Es gab einen Fehler beim Löschen des Polls!', error);
        }
    }
}

export default new PollService();