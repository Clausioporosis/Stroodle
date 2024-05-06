import React, { useState, useEffect } from 'react';
import './CreatePoll.css';
import Header from "../../common/header/Header"
import PollService from '../../../services/PollService';
import UserService from '../../../services/UserService';
import { Poll } from '../../../models/Poll';
import { User } from '../../../models/User';

import SearchBar from './searchBar/SearchBar';
import AddedParticipants from './addedParticipants/AddedParticipants';

const Dashboard: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [participants, setParticipants] = useState<User[]>([]);
    const [duration, setDuration] = useState('15');

    useEffect(() => {
    }, []);

    const addParticipant = (user: User) => {
        if (!participants.some(participant => participant.id === user.id)) {
            setParticipants(prevParticipants => [...prevParticipants, user]);
        } else {
            alert('Dieser Teilnehmer existiert bereits in der Liste.');
        }
    };

    const removeParticipant = (user: User) => {
        setParticipants(prevParticipants => prevParticipants.filter(participant => participant.id !== user.id));
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

                        <div className='lower-left-section'>

                            <div className='participants-section'>
                                <h3>Teilnehmer</h3>
                                <SearchBar onUserClick={addParticipant} />
                                <AddedParticipants participants={participants} removeSelectedParticipant={removeParticipant} />
                            </div>

                            <div className="more-settings-container">
                                <h3>Weitere Einstellungen</h3>
                                <div className="duration-container">
                                    <span>Dauer des Meetings: </span>
                                    <select value={duration} onChange={e => setDuration(e.target.value)}>
                                        <option value="15">15 Minuten</option>
                                        <option value="30">30 Minuten</option>
                                        <option value="45">45 Minuten</option>
                                        <option value="460">60 Minuten</option>
                                    </select>
                                </div>
                            </div>

                        </div>
                    </form>
                </div>
                <div className="right-section-container">


                </div>
            </div>
        </div>
    );
};

export default Dashboard;