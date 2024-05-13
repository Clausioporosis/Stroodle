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
    firstName: string;
    lastName: string;
    email: string;
    availability: Availability;

    constructor(id: string, firstName: string, lastName: string, email: string, availability: Availability) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.availability = availability;
    }
}