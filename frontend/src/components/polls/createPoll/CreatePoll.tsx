import React, { useState, useEffect } from 'react';
import HeaderComponent from "../../common/header/Header"
import { useNavigate, useParams } from 'react-router-dom';

import UserService from '../../../services/UserService';
import { User, } from '../../../models/User';
import PollService from '../../../services/PollService';
import { Poll, ProposedDate } from '../../../models/Poll';

import SearchBar from './searchBar/SearchBar';
import AddedParticipants from './addedParticipants/AddedParticipants';
import WeekView from '../../shared/weekView/WeekView';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { pollId } = useParams();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [duration, setDuration] = useState('15');
    const [selectedDuration, setSelectedDuration] = useState('15 Minuten');
    const [participantsIds, setParticipantsIds] = useState<string[]>([]);
    const [proposedDates, setProposedDates] = useState<ProposedDate[] | undefined>();

    //create a poll with the given data and navigate to the dashboard afterwards
    const createPoll = () => {
        const currentUser = UserService.getLoggedInUser();

        const newPoll: Poll = {
            organizerId: currentUser.id,
            title: title,
            description: description,
            location: location,
            participantIds: participantsIds,
            proposedDates: sortProposedDates(proposedDates || [])
        };

        if (pollId) {
            // If pollId is present, update the existing poll
            PollService.putPoll(pollId, newPoll).then(() => {
                alert('Umfrage wurde erfolgreich geändert.');
                navigate('/dashboard');
            })
                .catch(error => {
                    alert('Es gab einen Fehler beim ändern der Umfrage. Bitte versuchen Sie es erneut.');
                    console.error('Es gab einen Fehler beim ändern der Umfrage:', error);
                });
        } else {
            PollService.createPoll(newPoll)
                .then(() => {
                    alert('Umfrage wurde erfolgreich erstellt.');
                    navigate('/dashboard');
                })
                .catch(error => {
                    alert('Es gab einen Fehler beim erstellen der Umfrage. Bitte versuchen Sie es erneut.');
                    console.error('Es gab einen Fehler beim erstellen der Umfrage:', error);
                });
        }
    };

    useEffect(() => {
        if (pollId) {
            PollService.getPollById(pollId).then(poll => {
                setTitle(poll!.title);
                setDescription(poll!.description);
                setLocation(poll!.location);
                setParticipantsIds(poll!.participantIds);
                setProposedDates(poll!.proposedDates);
            });
        }
    }, [pollId]);

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
        console.log('saveProposedDate: ', start);
        const newProposedDate = new ProposedDate(start, duration, []);
        setProposedDates(prevProposedDates => [...prevProposedDates || [], newProposedDate]);
    }

    const sortProposedDates = (proposedDates: ProposedDate[]): ProposedDate[] => {
        return proposedDates.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    };

    function removeProposedDate(date: string, duration: string) {
        const filteredProposedDates = proposedDates?.filter(proposedDate => {
            console.log(new Date(date).toISOString() === new Date(proposedDate.date).toISOString());
            return !(new Date(date).toISOString() === new Date(proposedDate.date).toISOString() && duration === proposedDate.duration);
        });
        setProposedDates(filteredProposedDates || []);
    }

    useEffect(() => {
        console.log(duration);
    }, [duration]);

    return (
        <div className='app'>
            <HeaderComponent />
            <div className='app-body'>
                <div className='tab'>
                    <h1>Umfrage erstellen</h1>

                    <h3>Titel</h3>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Was ist der Anlass?" />
                    <h3>Beschreibung</h3>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Was muss man wissen?" />
                    <h3>Ort</h3>
                    <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Wo wird es statt finden?" />

                    <h3>Teilnehmer</h3>
                    <SearchBar onUserClick={addParticipant} />
                    <AddedParticipants participantsIds={participantsIds} removeSelectedParticipant={removeParticipant} />

                </div>

                <div className='tab'>
                    <h1>Termine aussuchen
                        <div className='header-button-group'>
                            <button className="header-button" onClick={createPoll}>Erstellen</button>
                        </div>
                    </h1>

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
                    <WeekView useCase='poll' duration={duration} saveProposedDate={saveProposedDate} proposedDates={proposedDates} pollId={pollId} removeProposedDate={removeProposedDate} />
                </div>

            </div>
        </div>
    );
};

export default Dashboard;