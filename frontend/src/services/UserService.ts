import { User } from '../models/User';

class UserService {
    private users: User[] = [];

    updateUserName(id: string, newName: string): User | undefined {
        const user = this.users.find(u => u.id === id);
        if (user) {
            user.name = newName;
        }
        return user;
    }

    updateUserEmail(id: string, newEmail: string): User | undefined {
        const user = this.users.find(u => u.id === id);
        if (user) {
            user.email = newEmail;
        }
        return user;
    }
}