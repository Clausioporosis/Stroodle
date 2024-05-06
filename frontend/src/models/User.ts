export class User {
    id: string;
    firstname: string;
    lastname: string;
    email: string;

    constructor(id: string, firstname: string, lastname: string, email: string) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
    }
}