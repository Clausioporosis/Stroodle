import { User } from './User';

export class ProposedDate {
    date: Date;
    duration: string;
    booked: boolean;
    votersId: string;

    constructor(date: Date, duration: string, booked: boolean, votersId: string) {
        this.date = date;
        this.duration = duration;
        this.booked = booked;
        this.votersId = votersId;
    }
}

export class Poll {
    id?: string;
    organizerId: String;
    title: string;
    description: string;
    location: string;
    participantsIds: string[];
    proposedDates: ProposedDate[];

    constructor(id: string, organizerId: string, title: string, description: string, location: string, participantsIds: string[], proposedDates: ProposedDate[]) {
        this.id = id;
        this.organizerId = organizerId;
        this.title = title;
        this.description = description;
        this.location = location;
        this.proposedDates = proposedDates;
        this.participantsIds = participantsIds;
    }
}