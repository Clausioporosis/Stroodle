import { User } from './User';

export class ProposedDate {
    date: Date;
    votersId: string;

    constructor(date: Date, votersId: string) {
        this.date = date;
        this.votersId = votersId;
    }
}

export class Poll {
    id: string;
    organizer: User;
    title: string;
    description: string;
    duration: number;
    proposedDates: ProposedDate[];
    participants: User[];

    constructor(id: string, organizer: User, title: string, description: string, duration: number, proposedDates: ProposedDate[], participants: User[]) {
        this.id = id;
        this.organizer = organizer;
        this.title = title;
        this.description = description;
        this.duration = duration;
        this.proposedDates = proposedDates;
        this.participants = participants;
    }
}