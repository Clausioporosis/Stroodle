import { User } from './User';

export interface Poll {
    id: string;
    title: string;
    description: string;
    duration: number;
    dates: Date[];
    users: User[];
}