import './CreatePoll.css';
import React, { useState, useEffect } from 'react';
import Header from "../../common/header/Header"

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

    useEffect(() => {
    }, []);

    const addParticipant = (user: User) => {
        /*
        if (!participants.some(participant => participant.id === user.id)) {
            setParticipants(prevParticipants => [...prevParticipants, user]);
        } else {
            alert('Dieser Teilnehmer existiert bereits in der Liste.');
        }
        */
    };

    const removeParticipant = (user: User) => {
        /*
        setParticipants(prevParticipants => prevParticipants.filter(participant => participant.id !== user.id));
        */
    };

    const handleDateClick = (selectDate: any) => {
        /*
        const now = new Date();
        const start = selectDate.date;
        const end = new Date(start.getTime() + Number(duration) * 60 * 1000);

        // Verhindern Sie die Auswahl von vergangenen Zeiten
        if (start < now) {
            alert('Past dates cannot be selected.');
            return;
        }

        // Check if the new time slot overlaps with any existing time slot
        for (let slot of selectedTimeSlots) {
            if ((start >= slot.start && start < slot.end) || (end > slot.start && end <= slot.end)) {
                alert('This time slot overlaps with an existing time slot.');
                return;
            }
        }

        setSelectedTimeSlots([...selectedTimeSlots, { start, end }]);
        console.log(selectedTimeSlots);
        */
    };

    return (
        <div className="create-poll-container">
            <Header />
            <div className="create-poll-content-container">

                {/*Left section*/}
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
                                        <option value="60">60 Minuten</option>
                                    </select>
                                </div>
                            </div>

                        </div>
                    </form>
                </div>

                {/*Right section*/}
                <div className="right-section-container">

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
                            events={selectedTimeSlots}
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