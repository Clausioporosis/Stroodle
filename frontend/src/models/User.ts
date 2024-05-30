export enum Weekday {
    SUNDAY = 'SUNDAY',
    MONDAY = 'MONDAY',
    TUESDAY = 'TUESDAY',
    WEDNESDAY = 'WEDNESDAY',
    THURSDAY = 'THURSDAY',
    FRIDAY = 'FRIDAY',
    SATURDAY = 'SATURDAY'
}

export type TimePeriod = {
    start: string;
    end: string;
};

export type Availability = {
    [key in Weekday]?: TimePeriod[];
};

export class User {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;

    constructor(id: string, username: string, firstName: string, lastName: string, email: string) {
        this.id = id;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }
}