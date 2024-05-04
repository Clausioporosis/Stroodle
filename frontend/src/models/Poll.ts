import { User } from './User';

export class Poll {
    id: string;
    creatorId: string;
    title: string;
    description: string;
    duration: number;
    dates: Date[];
    participants: User[];

    constructor(id: string, creatorId: string, title: string, description: string, duration: number, dates: Date[], participants: User[]) {
        this.id = id;
        this.creatorId = creatorId;
        this.title = title;
        this.description = description;
        this.duration = duration;
        this.dates = dates;
        this.participants = participants;
    }
}