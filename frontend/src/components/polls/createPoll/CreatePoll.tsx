import React, { useState, useEffect } from 'react';
import Header from "../../common/header/Header"
import { useNavigate } from 'react-router-dom';
import PollService from '../../../services/PollService';
import { Poll, ProposedDate } from '../../../models/Poll';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import SearchBar from './searchBar/SearchBar';
import AddedParticipants from './addedParticipants/AddedParticipants';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [organizerId, setOrganizerId] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [duration, setDuration] = useState('15');
    const [participantsIds, setParticipantsIds] = useState<string[]>([]);
    const [proposedDates, setProposedDates] = useState<ProposedDate[]>([]);
    const [passedTimeSlots, setPassedTimeSlots] = useState({
        start: new Date(0, 0, 0),
        end: new Date(),
        display: 'background',
        color: '#ddd'
    });

    //create a poll with the given data and navigate to the dashboard afterwards
    const createPoll = () => {
        const newPoll: Poll = {
            organizerId: organizerId,
            title: title,
            description: description,
            location: location,
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

    // methods for the calendar week view
    const handleDateClick = (selectedDate: any) => {
        const currentDate = new Date();
        const selectedDateObject = new Date(selectedDate.dateStr);

        if (selectedDateObject >= currentDate) {
            const newProposedDate = new ProposedDate(selectedDate.dateStr, duration, false, '');
            setProposedDates(prevProposedDates => [...prevProposedDates, newProposedDate]);
        } else {
            alert('Noch gibt es keine Zeitreisen. Bitte wähle ein Datum in der Zukunft.');
        }
    };

    // refresh the passedTimeSlots every minute
    useEffect(() => {
        const intervalId = setInterval(() => {
            setPassedTimeSlots({
                start: new Date(0, 0, 0),
                end: new Date(),
                display: 'background',
                color: '#ddd'
            });
        }, 10000); // every 10 seconds

        return () => clearInterval(intervalId);
    }, []);

    // format the proposed dates for the calendar and add passedTimeSlots
    const proposedDatesForCalendar = proposedDates.map(proposedDate => {
        const endDate = new Date(proposedDate.date);
        endDate.setMinutes(endDate.getMinutes() + Number(proposedDate.duration));
        return {
            start: proposedDate.date,
            end: endDate,
        };
    }).concat([passedTimeSlots]);

    // duration selection logic
    type OptionInfo = {
        value: string;
        text: string;
        disabled?: boolean;
        selected?: boolean;
    };

    const renderDurationDropdown = (element: Element): void => {
        const durationSelect = document.createElement('select');
        durationSelect.title = 'Termin Dauer';
        durationSelect.className = 'duration-select';

        const options: OptionInfo[] = [
            { value: '', text: '15 Minuten', disabled: true, selected: true },
            { value: '15', text: '15 Minuten' },
            { value: '30', text: '30 Minuten' },
            { value: '45', text: '45 Minuten' },
            { value: 'allDay', text: 'Ganztägig' },
            { value: 'custom', text: 'Individuell' }
        ];

        options.forEach(({ value, text, disabled, selected }) => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = text;
            if (disabled) option.disabled = true;
            if (selected) option.selected = true;
            durationSelect.appendChild(option);
        });

        durationSelect.addEventListener('change', event => handleDurationChange(event.target as HTMLSelectElement));

        element.appendChild(durationSelect);
    };

    function handleDurationChange(durationSelect: HTMLSelectElement): void {
        const selectedValue = durationSelect.value;
        if (selectedValue === 'custom') {
            promptCustomDuration(durationSelect);
        } else if (selectedValue === 'allDay') {
            updateDurationOption(durationSelect, 'Ganztägig');  // Spezielle Behandlung für ganztägige Ereignisse
        } else {
            updateDurationOption(durationSelect, selectedValue + ' Minuten');
            setDuration(selectedValue);
        }
    }

    //fehlerbehandlung einfügen + modal
    function promptCustomDuration(durationSelect: HTMLSelectElement): void {
        let userInput = prompt("Bitte geben Sie etwas ein:");
        if (userInput === null) {
            resetDurationSelection(durationSelect);
        } else {
            const duration = userInput || 'custom';
            updateDurationOption(durationSelect, duration + ' Minuten');
            setDuration(duration);
        }
    }

    function updateDurationOption(durationSelect: HTMLSelectElement, duration: string): void {
        const displayedOption = durationSelect.options[0];
        displayedOption.text = duration;
        durationSelect.selectedIndex = 0;
    }

    function resetDurationSelection(durationSelect: HTMLSelectElement): void {
        durationSelect.selectedIndex = 0;
    }

    useEffect(() => {
        const toolbarElement = document.querySelector('.fc-duration-button');
        if (toolbarElement) {
            renderDurationDropdown(toolbarElement);
        }
    }, []);



    return (
        <div className="create-poll-page">
            <Header />
            <div className="create-poll-body">

                <div className='left-section'>
                    <h1>Umfrage erstellen</h1>
                    <div className='upper-section'>
                        <form>
                            <h3>Titel</h3>
                            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Was ist der Anlass?" />
                            <h3>Beschreibung</h3>
                            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Was muss man wissen?" />
                            <h3>Ort</h3>
                            <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Wo wird es statt finden?" />
                        </form>
                    </div>
                    <div className='lower-section'>
                        <div className='left-lower-section'>
                            <h3>Teilnehmer</h3>
                            <SearchBar onUserClick={addParticipant} />
                            <AddedParticipants participantsIds={participantsIds} removeSelectedParticipant={removeParticipant} />
                        </div>
                        <div className='right-lower-section'>
                            <h3>Weitere Einstellungen</h3>
                        </div>
                    </div>

                </div>

                <div className='right-section'>
                    <h1>Termine hinzufügen
                        <button className="header-button" onClick={createPoll}>Erstellen</button>
                    </h1>
                    <div className='calender-container'>
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView="timeGridWeek"
                            height={'100%'}
                            firstDay={1}
                            allDaySlot={true}
                            nowIndicator={true}
                            locale={'de'}
                            headerToolbar={{
                                left: 'prev,next,today,duration',
                                center: 'title',
                                right: 'dayGridMonth,timeGridWeek'
                            }}

                            customButtons={{
                                duration: {
                                    text: 'Dauer',
                                }
                            }}

                            snapDuration="00:05:00"

                            dateClick={handleDateClick}
                            events={proposedDatesForCalendar}
                        />
                    </div>
                    {/* <div className='upper-section'>
                        <div className='left-upper-section'>

                        </div>
                        <div className='right-upper-section'>

                        </div>
                    </div>
                    <div className='lower-section'>
                    </div> */}
                </div>


            </div>
        </div>
    );
};

export default Dashboard;