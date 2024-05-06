import { User } from '../models/User';
import { mockUsers } from '../tests/MockData';

class UserService {
    private users: User[] = [...mockUsers];

    getAllUsers(): User[] {
        return this.users;
    }

    searchUsers(searchTerm: string): User[] {
        return this.users.filter(user =>
            user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    getUserById(id: string): User | undefined {
        return this.users.find(user => user.id === id);
    }

    updateUserName(id: string, newFirstName: string, newLastName: string): User | undefined {
        const user = this.users.find(u => u.id === id);
        if (user) {
            user.firstName = newFirstName;
            user.lastName = newLastName;
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