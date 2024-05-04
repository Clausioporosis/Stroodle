import { Poll } from '../models/Poll';
import { mockPolls } from '../tests/MockData';

class PollService {
    private polls: Poll[] = [...mockPolls];

    createPoll(poll: Poll): Poll {
        this.polls.push(poll);
        return poll;
    }

    getAllPolls(): Poll[] {
        return this.polls;
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

    deletePollById(id: string): void {
        const index = this.polls.findIndex(p => p.id === id);
        if (index !== -1) {
            this.polls.splice(index, 1);
        }
    }
}

export default new PollService();