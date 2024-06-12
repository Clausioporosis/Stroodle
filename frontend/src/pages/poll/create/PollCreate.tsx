import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import PollService from '../../../services/PollService';
import UserService from '../../../services/UserService';
import { Poll, ProposedDate } from '../../../models/Poll';
import { Availability } from '../../../models/User';

import SearchBar from '../../../components/polls/create/searchBar/SearchBar';
import AddedParticipants from '../../../components/polls/create/addedParticipants/AddedParticipants';
import WeekView from '../../../components/shared/weekView/WeekView';

import { CalendarX, CalendarCheck, CalendarPlus } from 'react-bootstrap-icons';
import { useKeycloak } from '@react-keycloak/web';
import OutlookService from '../../../services/OutlookService';
import Modal from '../../../components/shared/modal/Modal';

const PollCreate: React.FC = () => {
    const navigate = useNavigate();
    const { pollId } = useParams();
    const { keycloak } = useKeycloak();
    const pollService = new PollService(keycloak);
    const userService = new UserService(keycloak);
    const outlookService = new OutlookService(keycloak);

    const descriptionRef = useRef<HTMLTextAreaElement>(null);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [duration, setDuration] = useState('15');
    const [selectedDuration, setSelectedDuration] = useState('15 Minuten');
    const [participantsIds, setParticipantsIds] = useState<string[]>([]);
    const [proposedDates, setProposedDates] = useState<ProposedDate[] | undefined>();
    const [icsStatus, setIcsStatus] = useState<{ isStored: boolean, isValid: boolean, url: string } | undefined>();
    const [icsEvents, setIcsEvents] = useState<any[] | undefined>();
    const [mergedAvailability, setMergedAvailability] = useState<Availability | undefined>();

    const [isModalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState<string>('');
    const [confirmButtonText, setConfirmButtonText] = useState<string | undefined>(undefined);
    const [showCloseButton, setShowCloseButton] = useState<boolean>(true);
    const [cancelButtonText, setCancelButtonText] = useState<string | undefined>();
    const [icsUrl, setIcsUrl] = useState<string>('');
    const [customDuration, setCustomDuration] = useState('');

    useEffect(() => {
        adjustTextareaHeight(descriptionRef.current);
    }, [description]);

    useEffect(() => {
        if (pollId) {
            loadPoll(pollId);
        }
    }, [pollId]);

    useEffect(() => {
        checkIcsStatus();
    }, []);

    useEffect(() => {
        if (participantsIds.length > 0) {
            fetchMergedAvailability();
        }
    }, [participantsIds]);

    const adjustTextareaHeight = (textarea: HTMLTextAreaElement | null) => {
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
        adjustTextareaHeight(e.target);
    };

    const loadPoll = async (id: string) => {
        try {
            const poll = await pollService.getPollById(id);
            if (poll) {
                setTitle(poll.title);
                setDescription(poll.description);
                setLocation(poll.location);
                setParticipantsIds(poll.participantIds);
                setProposedDates(poll.proposedDates);
            }
        } catch (error) {
            console.error('Error loading poll:', error);
        }
    };

    const createPoll = async () => {
        const newPoll: Poll = {
            organizerId: keycloak.tokenParsed?.sub!,
            title,
            description,
            location,
            participantIds: participantsIds,
            proposedDates: sortProposedDates(proposedDates || [])
        };

        try {
            if (pollId) {
                await pollService.putPoll(pollId, newPoll);
            } else {
                await pollService.createPoll(newPoll);
            }
            navigate('/dashboard');
        } catch (error) {
            alert('Es gab einen Fehler beim Speichern der Umfrage. Bitte versuchen Sie es erneut.');
            console.error('Error saving poll:', error);
        }
    };

    const addParticipant = (addedParticipantId: string) => {
        if (!participantsIds.includes(addedParticipantId)) {
            setParticipantsIds(prev => [...prev, addedParticipantId]);
        }
    };

    const removeParticipant = (removedParticipantId: string) => {
        setParticipantsIds(prev => prev.filter(id => id !== removedParticipantId));
    };

    const fetchMergedAvailability = async () => {
        try {
            const response = await userService.mergeAvailabilities(participantsIds);
            const availability = response.availability;
            setMergedAvailability(availability);
        } catch (error) {
            console.error('Error fetching merged availability:', error);
        }
    };

    const saveProposedDate = (start: Date) => {
        const newProposedDate = new ProposedDate(start, duration, []);
        setProposedDates(prev => [...prev || [], newProposedDate]);
    };

    const sortProposedDates = (dates: ProposedDate[]): ProposedDate[] => {
        return dates.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    };

    const removeProposedDate = (date: string, duration: string) => {
        const filteredDates = proposedDates?.filter(d => !(new Date(date).toISOString() === new Date(d.date).toISOString() && duration === d.duration));
        setProposedDates(filteredDates || []);
    };

    const handleDurationSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value === "custom") {
            handleCustomDurationClick();
        } else if (value === "allDay") {
            setDuration(value);
            setSelectedDuration('Ganztägig');
        } else {
            setDuration(value);
            setSelectedDuration(value + ' Minuten');
        }
    };

    const handleCustomDurationClick = () => {
        setModalOpen(true);
        setModalTitle('Dauer eingeben');
        setConfirmButtonText('Speichern');
        setCancelButtonText("Abbrechen");
        setShowCloseButton(false);
    };

    const hasErrors = () => {
        const errors: string[] = [];
        if (title === '') errors.push('Titel darf nicht leer sein');
        if (participantsIds.length === 0) errors.push('Es muss mindestens einen Teilnehmer geben');
        if (!proposedDates || proposedDates.length === 0) errors.push('Es muss mindestens 1 Termin ausgewählt sein');
        return errors;
    };

    const handleCreateClick = () => {
        setModalOpen(true);
        const errors = hasErrors();
        if (errors.length === 0) {
            setModalTitle('Umfrage erstellen?');
            setConfirmButtonText('Erstellen');
            setCancelButtonText("Abbrechen");
        } else {
            setModalTitle('Prüfe deine Eingaben!');
            setConfirmButtonText(undefined);
            setCancelButtonText(undefined);
        }
        setShowCloseButton(errors.length > 0);
    };

    const handleUpdateClick = () => {
        setModalOpen(true);
        const errors = hasErrors();
        if (errors.length === 0) {
            setModalTitle('Umfrage aktualisieren?');
            setConfirmButtonText('Aktualisieren');
            setCancelButtonText("Abbrechen");
        } else {
            setModalTitle('Prüfe deine Eingaben!');
            setConfirmButtonText(undefined);
            setCancelButtonText(undefined);
        }
        setShowCloseButton(errors.length > 0);
    };

    const renderModalContent = () => {
        if (modalTitle === 'Dauer eingeben') {
            return (
                <input
                    type="text"
                    value={customDuration}
                    onChange={handleCustomDurationChange}
                    placeholder="Benutzerdefinierte Dauer in Minuten"
                />
            );
        }
        if (modalTitle === 'Kalender verknüpfen') {
            return (
                <>
                    <p>Veröffentlichen und speichern Sie den ICS-Link Ihres Kalenders, um diesen zu Importieren.</p>
                    <p className='calendar-links'>
                        <a className='link' href="https://outlook.live.com/calendar/0/options/calendar/SharedCalendars" target="_blank" rel="noopener noreferrer">Outlook</a>
                        <a className='link' href="https://calendar.google.com/calendar/u/1/r/settings" target="_blank" rel="noopener noreferrer">Google</a>
                    </p>
                    <input
                        type="text"
                        value={icsUrl}
                        onChange={handleIcsChange}
                        placeholder="ICS-Link eingeben"
                    />
                    {!icsStatus?.isValid && icsStatus?.url !== null && icsStatus?.url !== '' && <span className='red'><CalendarX className='icon red' />{" ICS-Link ist nicht gültig"}</span>}
                </>
            );
        }
        if (modalTitle === 'Prüfe deine Eingaben!') {
            const errors = hasErrors();
            return (
                <>
                    {errors.map((error, index) => (
                        <p key={index} className='red'>{error}</p>
                    ))}
                </>
            );
        }
        return null;
    };

    const handleIcsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIcsUrl(event.target.value);
    };

    const handleCustomDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCustomDuration(event.target.value);
    };

    const handleConfirm = () => {
        if (modalTitle === 'Dauer eingeben') {
            setDuration(customDuration);
            setSelectedDuration(customDuration + ' Minuten');
        }
        if (modalTitle === 'Kalender verknüpfen') {
            outlookService.submitIcsUrl(icsUrl)
                .then(() => {
                    setIcsEvents(undefined);
                    checkIcsStatus();
                })
                .catch(error => {
                    console.error('Error saving ICS URL:', error);
                });
        }
        if (modalTitle === 'Umfrage erstellen?' || modalTitle === 'Umfrage aktualisieren?') {
            createPoll();
        }
        setModalOpen(false);
    };

    const handleCancel = () => {
        setModalOpen(false);
    };

    const handleIcsButtonClick = () => {
        setModalOpen(true);
        setModalTitle('Kalender verknüpfen');
        setConfirmButtonText('Speichern');
        setCancelButtonText("Abbrechen");
        setShowCloseButton(false);
    };

    const checkIcsStatus = async () => {
        try {
            const status = await outlookService.checkIcsStatus();
            setIcsUrl(status.url);
            setIcsStatus({ isStored: status.stored, isValid: status.valid, url: status.url });
            if (status.stored && status.valid) {
                const events = await outlookService.getIcsEvents();
                setIcsEvents(events);
            }
        } catch (error) {
            console.error('Error checking ICS status:', error);
        }
    };

    return (
        <div className='app-body'>
            <div className='tab grow-tab'>
                <h1>Umfrage erstellen
                    <div className='header-button-group'>
                    </div>
                </h1>
                <h3>Titel</h3>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Was ist der Anlass?" />
                <h3>Beschreibung</h3>
                <textarea
                    ref={descriptionRef}
                    value={description}
                    onChange={handleDescriptionChange}
                    placeholder="Was muss man wissen?"
                />
                <h3>Ort</h3>
                <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Wo wird es statt finden?" />

                <h3>Teilnehmer</h3>
                <SearchBar onUserClick={addParticipant} participantsIds={participantsIds} />
                <AddedParticipants participantsIds={participantsIds} removeSelectedParticipant={removeParticipant} />
            </div>

            <div className='tab'>
                <h1>Termine aussuchen
                    <div className='header-button-group'>

                        <button className="header-button" onClick={handleIcsButtonClick}>
                            {icsStatus ?
                                (icsStatus.isStored && icsStatus.url !== '' ?
                                    (icsStatus.isValid ?
                                        <><CalendarCheck className='icon orange' /> Kalender</>
                                        :
                                        <><CalendarX className='icon red' /> Kalender</>)
                                    :
                                    <><CalendarPlus className='icon' /> Kalender</>)
                                :
                                'laden...'}
                        </button>
                        {pollId ? <button className="header-button" onClick={handleUpdateClick}>Aktualisieren</button>
                            :
                            <button className="header-button" onClick={handleCreateClick}>Erstellen</button>}

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
                    <option value="custom">Benutzerdefiniert</option>
                </select>
                <WeekView
                    useCase='poll'
                    duration={duration}
                    saveProposedDate={saveProposedDate}
                    proposedDates={proposedDates}
                    pollId={pollId}
                    removeProposedDate={removeProposedDate}
                    icsStatus={icsStatus}
                    icsEvents={icsEvents}
                    mergedAvailability={mergedAvailability}
                />
            </div>

            <Modal
                isOpen={isModalOpen}
                title={modalTitle}
                content={renderModalContent()}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                confirmButtonText={confirmButtonText}
                cancelButtonText={cancelButtonText}
                showCloseButton={showCloseButton}
            />
        </div>
    );
};

export default PollCreate;
