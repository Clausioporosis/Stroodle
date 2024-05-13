export class ProposedDate {
    date: Date;
    duration: string;
    votersId: string[];

    constructor(date: Date, duration: string, votersId: string[]) {
        this.date = date;
        this.duration = duration;
        this.votersId = votersId;
    }
}

export class Poll {
    id?: string;
    organizerId: String;
    title: string;
    description: string;
    location: string;
    participantIds: string[];
    proposedDates: ProposedDate[];
    bookedDateIndex?: number;

    constructor(id: string, organizerId: string, title: string, description: string, location: string, participantsIds: string[], proposedDates: ProposedDate[], bookedDateIndex: number) {
        this.id = id;
        this.organizerId = organizerId;
        this.title = title;
        this.description = description;
        this.location = location;
        this.proposedDates = proposedDates;
        this.participantIds = participantsIds;
        this.bookedDateIndex = bookedDateIndex;
    }
}