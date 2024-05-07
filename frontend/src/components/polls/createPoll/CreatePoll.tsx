import './CreatePoll.css';
import React, { useState, useEffect } from 'react';
import Header from "../../common/header/Header"

import { useNavigate } from 'react-router-dom';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction";

import PollService from '../../../services/PollService';
import UserService from '../../../services/UserService';
import { Poll, ProposedDate } from '../../../models/Poll';
import { User } from '../../../models/User';

import SearchBar from './searchBar/SearchBar';
import AddedParticipants from './addedParticipants/AddedParticipants';

const Dashboard: React.FC = () => {
    const [organizerId, setOrganizerId] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [duration, setDuration] = useState('15');
    const [participantsIds, setParticipantsIds] = useState<string[]>([]);
    const [proposedDates, setProposedDates] = useState<ProposedDate[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
    }, []);

    const createPoll = () => {
        const newPoll: Poll = {
            organizerId: organizerId,
            title: title,
            description: description,
            location: location,
            duration: Number(duration),
            participantsIds: participantsIds,
            proposedDates: proposedDates
        };

        PollService.createPoll(newPoll)
            .then(createdPoll => {
                console.log('Erstellte Umfrage:', createdPoll);
                navigate('/dashboard');
            })
            .catch(error => {
                console.error('Es gab einen Fehler beim Erstellen der Umfrage:', error);
            });
    };

    const addParticipant = (addedParticipantId: string) => {
        if (!participantsIds.some(participantId => participantId === addedParticipantId)) {
            setParticipantsIds(prevParticipantsIds => [...prevParticipantsIds, addedParticipantId]);
        } else {
            alert('Dieser Teilnehmer existiert bereits in der Liste.');
        }
    };

    const removeParticipant = (removedParticipantId: string) => {
        setParticipantsIds(prevParticipantsIds => prevParticipantsIds.filter(participantid => participantid !== removedParticipantId));
    };

    const handleDateClick = (selectedDate: any) => {
        const currentDate = new Date();
        const selectedDateObject = new Date(selectedDate.dateStr);

        if (selectedDateObject >= currentDate) {
            const newProposedDate = new ProposedDate(selectedDate.dateStr, '');
            setProposedDates(prevProposedDates => [...prevProposedDates, newProposedDate]);
        } else {
            alert('Noch gibt es keine Zeitreisen. Bitte wähle ein Datum in der Zukunft.');
        }
    };

    const proposedDatesForCalendar = proposedDates.map(proposedDate => {
        const endDate = new Date(proposedDate.date);
        endDate.setMinutes(endDate.getMinutes() + Number(duration));
        return {
            start: proposedDate.date,
            end: endDate,
            title: '',
        };
    });

    return (
        <div className="create-poll-container">
            <Header />
            <div className="create-poll-content-container">

                {/*Left section*/}
                <div className="left-section-container">
                    <h1>Umfrage erstellen</h1>
                    <form>
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
                                <AddedParticipants participantsIds={participantsIds} removeSelectedParticipant={removeParticipant} />
                            </div>

                            <div className="more-settings-container">
                                <h3>Weitere Einstellungen</h3>
                                <div className="duration-container">
                                    <span>Dauer des Meetings: </span>
                                    <select value={duration} onChange={e => setDuration(e.target.value)}>
                                        <option value="15">15 Minuten</option>
                                        <option value="30">30 Minuten</option>
                                        <option value="45">45 Minuten</option>
                                        <option value="60">60 Minuten</option>
                                    </select>
                                </div>
                            </div>

                        </div>
                    </form>
                </div>

                {/*Right section*/}
                <div className="right-section-container">
                    <h1>Termine hinzufügen
                        <button className="header-button" onClick={createPoll}>Erstellen</button>
                    </h1>

                    <div className="right-upper-section-container">

                        <div className="month-container">
                        </div>

                        <div className="date-list-container">
                        </div>

                    </div>

                    <div className="week-container">
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView="timeGridWeek"
                            firstDay={1}
                            headerToolbar={{
                                start: 'prev,next,today',
                                center: 'title',
                                end: ''
                            }}
                            dateClick={handleDateClick}
                            events={proposedDatesForCalendar}
                            slotMinTime="00:00"
                            slotMaxTime="24:00"
                            allDaySlot={false}
                            slotLabelFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
                            nowIndicator={true}
                            snapDuration="00:05:00"
                            selectOverlap={false}
                        />
                    </div>

                </div>
            </div>
        </div >
    );
};

export default Dashboard;