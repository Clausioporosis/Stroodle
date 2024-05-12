enum Weekday {
    Monday = 'Monday',
    Tuesday = 'Tuesday',
    Wednesday = 'Wednesday',
    Thursday = 'Thursday',
    Friday = 'Friday',
    Saturday = 'Saturday',
    Sunday = 'Sunday'
}

type TimePeriod = {
    start: string;
    end: string;
};

type Availability = {
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