import { User } from '../models/User';
import { mockUsers } from '../tests/MockData';

class UserService {
    private users: User[] = [...mockUsers];

    getAllUsers(): User[] {
        return this.users;
    }

    searchUsers(searchTerm: string): User[] {
        return this.users.filter(user =>
            user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    getUserById(id: string): User | undefined {
        return this.users.find(user => user.id === id);
    }

    updateUserName(id: string, newFirstName: string, newLastName: string): User | undefined {
        const user = this.users.find(u => u.id === id);
        if (user) {
            user.firstname = newFirstName;
            user.lastname = newLastName;
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

export default new UserService();