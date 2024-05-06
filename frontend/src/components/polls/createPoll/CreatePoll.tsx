import React, { useState, useEffect } from 'react';
import './CreatePoll.css';
import Header from "../../common/header/Header"
import PollService from '../../../services/PollService';
import UserService from '../../../services/UserService';
import { Poll } from '../../../models/Poll';
import { User } from '../../../models/User';

const Dashboard: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [participants, setParticipants] = useState<User[]>([]);
    const [duration, setDuration] = useState('');
    const [timeLimit, setTimeLimit] = useState(false);
    const [participantLimit, setParticipantLimit] = useState(false);
    const [reminder, setReminder] = useState(false);

    const [searchQuery, setSearchQuery] = useState(''); // new state for search query
    const [searchResults, setSearchResults] = useState<User[]>([]);

    useEffect(() => {
    }, []);

    const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        if (e.target.value !== '') {
            const results = await UserService.getAllUsers();
            const filteredResults = results.filter(user =>
                user.firstname.toLowerCase().includes(e.target.value.toLowerCase()) ||
                user.lastname.toLowerCase().includes(e.target.value.toLowerCase()) ||
                user.email.toLowerCase().includes(e.target.value.toLowerCase())
            );
            setSearchResults(filteredResults);
        } else {
            setSearchResults([]);
        }
    };

    const handleAddParticipant = (user: User) => {
        setParticipants([...participants, user]);
    };



    return (
        <div className="create-poll-container">
            <Header />
            <div className="create-poll-content-container">
                <div className="left-section-container">
                    <form>
                        <h1>Umfrage erstellen</h1>
                        <h3>Titel </h3>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Was ist der Anlass?" />
                        <h3>Beschreibung</h3>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Was muss man wissen?" />
                        <h3>Ort</h3>
                        <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Wo wird es statt finden?" />
                        <h3>Teilnehmer</h3>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search participants..."
                            list="user-list"
                        />
                        <datalist id="user-list">
                            {searchResults.map(user => (
                                <option key={user.id} value={user.firstname + ' ' + user.lastname + ' (' + user.email + ')'} />
                            ))}
                        </datalist>

                        <div className="more-settings-container">
                            <h3 className="more-settings-header">Weitere Einstellungen</h3>
                            <div className="header-border"></div>
                        </div>
                        {/*
                        <input type="text" value={participants} onChange={e => setParticipants(e.target.value)} placeholder="Participants" />
                        Additional participant search and add functionality
                        <input type="text" value={duration} onChange={e => setDuration(e.target.value)} placeholder="Duration" />
                        <label>
                            <input type="checkbox" checked={timeLimit} onChange={e => setTimeLimit(e.target.checked)} />
                            Time Limit
                        </label>
                        <label>
                            <input type="checkbox" checked={participantLimit} onChange={e => setParticipantLimit(e.target.checked)} />
                            Participant Limit
                        </label>
                        <label>
                            <input type="checkbox" checked={reminder} onChange={e => setReminder(e.target.checked)} />
                            Reminder
                        </label>
                        */}
                    </form>
                </div>
                <div className="right-section-container">


                </div>
            </div>
        </div>
    );
};

export default Dashboard;