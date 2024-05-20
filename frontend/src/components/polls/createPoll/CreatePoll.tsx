import React, { useState, useEffect } from 'react';
import HeaderComponent from "../../common/header/Header"
import { useNavigate } from 'react-router-dom';

import UserService from '../../../services/UserService';
import { User, } from '../../../models/User';
import PollService from '../../../services/PollService';
import { Poll, ProposedDate } from '../../../models/Poll';

import SearchBar from './searchBar/SearchBar';
import AddedParticipants from './addedParticipants/AddedParticipants';
import WeekView from '../../shared/weekView/WeekView';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [duration, setDuration] = useState('15');
    const [selectedDuration, setSelectedDuration] = useState('15 Minuten');
    const [participantsIds, setParticipantsIds] = useState<string[]>([]);
    const [proposedDates, setProposedDates] = useState<ProposedDate[]>([]);

    //create a poll with the given data and navigate to the dashboard afterwards
    const createPoll = () => {
        const currentUser = UserService.getLoggedInUser();

        const newPoll: Poll = {
            organizerId: currentUser.id,
            title: title,
            description: description,
            location: location,
            participantIds: participantsIds,
            proposedDates: proposedDates
        };

        PollService.createPoll(newPoll)
            .then(() => {
                alert('Umfrage wurde erfolgreich erstellt.');
                navigate('/dashboard');
            })
            .catch(error => {
                alert('Es gab einen Fehler beim Erstellen der Umfrage. Bitte versuchen Sie es erneut.');
                console.error('Es gab einen Fehler beim Erstellen der Umfrage:', error);
            });
    };

    // add a participant to the list
    const addParticipant = (addedParticipantId: string) => {

        if (!participantsIds.some(participantId => participantId === addedParticipantId)) {
            setParticipantsIds(prevParticipantsIds => [...prevParticipantsIds, addedParticipantId]);
        } else {
            alert('Dieser Teilnehmer existiert bereits in der Liste.');
        }
    };

    // remove a participant from the list
    const removeParticipant = (removedParticipantId: string) => {
        setParticipantsIds(prevParticipantsIds => prevParticipantsIds.filter(participantid => participantid !== removedParticipantId));
    };

    function handleDurationSelect(element: any) {
        const value = element.target.value;
        if (value === "custom") {
            const customDuration = window.prompt("Bitte geben Sie eine benutzerdefinierte Dauer ein:");
            if (!customDuration) return;
            setDuration(customDuration);
            setSelectedDuration(customDuration + ' Minuten');
        } else if (value === "allDay") {
            setDuration(value);
            setSelectedDuration('Ganztägig');
        } else {
            setDuration(value);
            setSelectedDuration(value + ' Minuten');
        }
    };

    function saveProposedDate(start: Date) {
        const newProposedDate = new ProposedDate(start, duration, []);
        setProposedDates(prevProposedDates => {
            const updatedProposedDates = [...prevProposedDates, newProposedDate];
            updatedProposedDates.sort((a, b) => a.date.getTime() - b.date.getTime());
            return updatedProposedDates;
        });
        console.log('Proposed Dates:', proposedDates);
    }

    return (
        <div className='app'>
            <HeaderComponent />
            <div className='app-body'>
                <div className='content-tab'>
                    <h1>Umfrage erstellen</h1>
                    <div className='tab-item'>
                        <h3>Titel</h3>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Was ist der Anlass?" />
                        <h3>Beschreibung</h3>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Was muss man wissen?" />
                        <h3>Ort</h3>
                        <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Wo wird es statt finden?" />
                    </div>
                    <div className='tab-item row-section'>
                        <div className='tab-item'>
                            <h3>Teilnehmer</h3>
                            <SearchBar onUserClick={addParticipant} />
                            <AddedParticipants participantsIds={participantsIds} removeSelectedParticipant={removeParticipant} />
                        </div>
                        {/*
                        <div className='tab-item right-section'>
                            <h3>Weitere Einstellungen</h3>
                        </div>
                        */}
                    </div>
                </div>

                <div className='content-tab'>
                    <h1>Termine aussuchen
                        <div className='header-button-group'>
                            <button className="header-button" onClick={createPoll}>Erstellen</button>
                        </div>
                    </h1>
                    <div className='tab-item'>
                        <select
                            title='Termin Dauer'
                            className='duration-select'
                            value={duration}
                            onChange={handleDurationSelect}
                        >
                            <option value={duration} disabled>{selectedDuration}</option>
                            <option value="15" >15 Minuten</option>
                            <option value="25">25 Minuten</option>
                            <option value="30">30 Minuten</option>
                            <option value="45">45 Minuten</option>
                            <option value="allDay">Ganztägig</option>
                            <option value="custom">Individuell</option>
                        </select>
                        <WeekView useCase='poll' duration={duration} saveProposedDate={saveProposedDate} />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;