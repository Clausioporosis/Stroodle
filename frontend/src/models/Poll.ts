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
    id?: string;
    organizerId: String;
    title: string;
    description: string;
    location: string;
    duration: number;
    participantsIds: string[];
    proposedDates: ProposedDate[];

    constructor(id: string, organizerId: string, title: string, description: string, location: string, duration: number, participantsIds: string[], proposedDates: ProposedDate[]) {
        this.id = id;
        this.organizerId = organizerId;
        this.title = title;
        this.description = description;
        this.location = location;
        this.duration = duration;
        this.proposedDates = proposedDates;
        this.participantsIds = participantsIds;
    }
}