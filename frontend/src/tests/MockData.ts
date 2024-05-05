import { User } from '../models/User';
import { Poll } from '../models/Poll';

// User Mock data
const mockUsers = [
    new User('0', 'admin', 'admin@doubleslash.de'),
    new User('1', 'user1', 'user1@doubleslash.de'),
    new User('2', 'user2', 'user2@doubleslash.de')
];

// Poll Mock data
const mockPolls = [
    new Poll(
        '0',
        mockUsers[0].id,
        'Erstes Meeting Erstes Meeting Erstes MeetingErstes Meeting Erstes Meeting',
        'Beschreibung für das erste Meeting...',
        30,
        [new Date(2024, 4, 8, 10), new Date(2024, 4, 8, 12), new Date(2024, 4, 9, 13, 30)],
        [mockUsers[1], mockUsers[2]]
    ),
    new Poll(
        '1',
        mockUsers[0].id,
        'Zweite Meeting',
        'Beschreibung für das zweite Meeting...',
        45,
        [new Date(2024, 4, 8, 10), new Date(2024, 4, 8, 12), new Date(2024, 4, 9, 13, 30)],
        [mockUsers[1]]
    ),
    new Poll(
        '2',
        mockUsers[0].id,
        'Dritte Meeting',
        'Beschreibung für das dritte Meeting...',
        15,
        [new Date(2024, 4, 8, 10), new Date(2024, 4, 8, 12), new Date(2024, 4, 9, 13, 30)],
        [mockUsers[2]]
    )
];

export { mockUsers, mockPolls };