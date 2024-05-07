import { Poll } from '../models/Poll';

import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api',
});

class PollService {
    private polls: Poll[] = [];

    createPoll(poll: Poll): Poll {
        this.polls.push(poll);
        return poll;
    }

    async getAllPolls(): Promise<Poll[]> {
        try {
            const response = await apiClient.get('/polls');
            console.log('Polls:', response.data);
            return response.data;
        } catch (error) {
            console.error('Es gab einen Fehler!', error);
            return [];
        }
    }

    getPollById(id: string): Poll | undefined {
        return this.polls.find(poll => poll.id === id);
    }

    updatePollById(id: string, updatedPoll: Partial<Poll>): Poll | undefined {
        const poll = this.polls.find(p => p.id === id);
        if (poll) {
            Object.assign(poll, updatedPoll);
        }
        return poll;
    }

    deletePollByIdOld(id: string): void {
        const index = this.polls.findIndex(p => p.id === id);
        if (index !== -1) {
            this.polls.splice(index, 1);
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