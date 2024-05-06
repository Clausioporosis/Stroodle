import { User } from '../models/User';
import { Poll } from '../models/Poll';

// User Mock data
const mockUsers = [
    new User('0', 'admin', '0', 'admin@doubleslash.de'),
    new User('1', 'user', '1', 'user1@doubleslash.de'),
    new User('2', 'user', '2', 'user2@doubleslash.de'),
    new User('3', 'user', '3', 'user3@doubleslash.de'),
    new User('4', 'user', '4', 'user4@doubleslash.de'),
    new User('5', 'user', '5', 'user5@doubleslash.de'),
    new User('6', 'user', '6', 'user6@doubleslash.de'),
    new User('7', 'user', '7', 'user7@doubleslash.de'),
    new User('8', 'user', '8', 'user8@doubleslash.de'),
    new User('9', 'user', '9', 'user9@doubleslash.de'),
    new User('10', 'user', '10', 'user10@doubleslash.de'),
    new User('11', 'user', '11', 'user11@doubleslash.de'),
    new User('12', 'user', '12', 'user12@doubleslash.de'),
    new User('13', 'user', '13', 'user13@doubleslash.de'),
    new User('14', 'user', '14', 'user14@doubleslash.de'),
    new User('15', 'user', '15', 'user15@doubleslash.de')
];

// Poll Mock data
const mockPolls = [
    new Poll(
        '0',
        mockUsers[0].id,
        'Ersteeeeeeees Meeeeeeeeeting',
        'Beschreibung für das erste Meeting...',
        30,
        [new Date(2024, 4, 8, 10), new Date(2024, 4, 8, 12), new Date(2024, 4, 9, 13, 30)],
        [mockUsers[1], mockUsers[2]]
    ),
    new Poll(
        '1',
        mockUsers[0].id,
        'Zweites Meeting',
        'Beschreibung für das zweite Meeting...',
        45,
        [new Date(2024, 4, 8, 10), new Date(2024, 4, 8, 12), new Date(2024, 4, 9, 13, 30)],
        [mockUsers[1]]
    ),
    new Poll(
        '2',
        mockUsers[0].id,
        'Drittes Meeting',
        'Beschreibung für das dritte Meeting...',
        15,
        [new Date(2024, 4, 8, 10), new Date(2024, 4, 8, 12), new Date(2024, 4, 9, 13, 30)],
        [mockUsers[2]]
    ),
    new Poll(
        '3',
        mockUsers[0].id,
        'Viertes Meeting',
        'Beschreibung für das vierte Meeting...',
        15,
        [new Date(2024, 4, 8, 10), new Date(2024, 4, 8, 12), new Date(2024, 4, 9, 13, 30)],
        [mockUsers[2]]
    ),
    new Poll(
        '4',
        mockUsers[0].id,
        'Fünftes Meeting',
        'Beschreibung für das fünfte Meeting...',
        15,
        [new Date(2024, 4, 8, 10), new Date(2024, 4, 8, 12), new Date(2024, 4, 9, 13, 30)],
        [mockUsers[2]]
    ),
    new Poll(
        '5',
        mockUsers[0].id,
        'Sechstes Meeting',
        'Beschreibung für das sechste Meeting...',
        15,
        [new Date(2024, 4, 8, 10), new Date(2024, 4, 8, 12), new Date(2024, 4, 9, 13, 30)],
        [mockUsers[2]]
    ),
    new Poll(
        '6',
        mockUsers[0].id,
        'Siebtes Meeting',
        'Beschreibung für das siebte Meeting...',
        15,
        [new Date(2024, 4, 8, 10), new Date(2024, 4, 8, 12), new Date(2024, 4, 9, 13, 30)],
        [mockUsers[2]]
    ),
    new Poll(
        '7',
        mockUsers[0].id,
        'Achtes Meeting',
        'Beschreibung für das achte Meeting...',
        15,
        [new Date(2024, 4, 8, 10), new Date(2024, 4, 8, 12), new Date(2024, 4, 9, 13, 30)],
        [mockUsers[2]]
    ),
    new Poll(
        '8',
        mockUsers[0].id,
        'Neuntes Meeting',
        'Beschreibung für das neunte Meeting...',
        15,
        [new Date(2024, 4, 8, 10), new Date(2024, 4, 8, 12), new Date(2024, 4, 9, 13, 30)],
        [mockUsers[2]]
    )
];

export { mockUsers, mockPolls };