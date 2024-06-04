import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import PollService from '../../../services/PollService';
import { Poll, ProposedDate } from '../../../models/Poll';

import SearchBar from '../../../components/polls/create/searchBar/SearchBar';
import AddedParticipants from '../../../components/polls/create/addedParticipants/AddedParticipants';
import WeekView from '../../../components/shared/weekView/WeekView';

import { CalendarX, CalendarCheck, CalendarPlus } from 'react-bootstrap-icons';


import { useKeycloak } from '@react-keycloak/web';
import OutlookService from '../../../services/OutlookService';

import Modal from '../../../components/shared/modal/Modal';

const Create: React.FC = () => {
    const navigate = useNavigate();
    const { pollId } = useParams();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [duration, setDuration] = useState('15');
    const [selectedDuration, setSelectedDuration] = useState('15 Minuten');
    const [participantsIds, setParticipantsIds] = useState<string[]>([]);
    const [proposedDates, setProposedDates] = useState<ProposedDate[] | undefined>();
    const [icsStatus, setIcsStatus] = useState<{ isStored: boolean, isValid: boolean, url: string } | undefined>();
    const [icsEvents, setIcsEvents] = useState<any[] | undefined>();

    const [isModalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState<string>('');
    const [confirmButtonText, setConfirmButtonText] = useState<string | undefined>(undefined);
    const [showCloseButton, setShowCloseButton] = useState<boolean>(true);
    const [cancelButtonText, setCancelButtonText] = useState<string | undefined>();
    const [icsUrl, setIcsUrl] = useState<string>('');

    const { keycloak } = useKeycloak();
    const pollService = new PollService(keycloak);
    const outlookService = new OutlookService(keycloak);

    useEffect(() => {
        if (pollId) {
            pollService.getPollById(pollId).then(poll => {
                setTitle(poll!.title);
                setDescription(poll!.description);
                setLocation(poll!.location);
                setParticipantsIds(poll!.participantIds);
                setProposedDates(poll!.proposedDates);
            });
        }
    }, [pollId]);

    const createPoll = () => {
        const newPoll: Poll = {
            organizerId: keycloak.tokenParsed?.sub!,
            title: title,
            description: description,
            location: location,
            participantIds: participantsIds,
            proposedDates: sortProposedDates(proposedDates || [])
        };

        if (pollId) {
            console.log('Updating poll:', newPoll);
            pollService.putPoll(pollId, newPoll)
                .then(() => {
                    navigate('/dashboard');
                })
                .catch(error => {
                    alert('Es gab einen Fehler beim ändern der Umfrage. Bitte versuchen Sie es erneut.');
                    console.error('Es gab einen Fehler beim ändern der Umfrage:', error);
                });
        } else {
            pollService.createPoll(newPoll)
                .then(() => {
                    navigate('/dashboard');
                })
                .catch(error => {
                    alert('Es gab einen Fehler beim erstellen der Umfrage. Bitte versuchen Sie es erneut.');
                    console.error('Es gab einen Fehler beim erstellen der Umfrage:', error);
                });
        }
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

    function saveProposedDate(start: Date) {
        const newProposedDate = new ProposedDate(start, duration, []);
        setProposedDates(prevProposedDates => [...prevProposedDates || [], newProposedDate]);
    }

    const sortProposedDates = (proposedDates: ProposedDate[]): ProposedDate[] => {
        return proposedDates.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    };

    function removeProposedDate(date: string, duration: string) {
        const filteredProposedDates = proposedDates?.filter(proposedDate => {
            return !(new Date(date).toISOString() === new Date(proposedDate.date).toISOString() && duration === proposedDate.duration);
        });
        setProposedDates(filteredProposedDates || []);
    }

    function handleDurationSelect(element: any) {
        const value = element.target.value;
        if (value === "custom") {
            handleCustomDurationClick();
        } else if (value === "allDay") {
            setDuration(value);
            setSelectedDuration('Ganztägig');
        } else {
            setDuration(value);
            setSelectedDuration(value + ' Minuten');
        }
    }
    const [customDuration, setCustomDuration] = useState('');

    const handleCustomDurationClick = () => {
        setModalOpen(true);
        setModalTitle('Dauer eingeben');
        setConfirmButtonText('Speichern');
        setCancelButtonText("Abbrechen");
        setShowCloseButton(false);
    };

    const hasErrors = () => {
        return title === '' || participantsIds.length === 0 || (!proposedDates || proposedDates.length === 0);
    };

    const handleCreateClick = () => {
        setModalOpen(true);
        if (!hasErrors()) {
            setModalTitle('Umfrage erstellen?');
            setConfirmButtonText('Erstellen');
            setCancelButtonText("Abbrechen");
        } else {
            setModalTitle('Prüfe deine Eingaben!');
            setConfirmButtonText(undefined);
            setCancelButtonText(undefined);
        }
        setShowCloseButton(hasErrors());
    };

    const handleUpdateClick = () => {
        setModalOpen(true);
        if (!hasErrors()) {
            setModalTitle('Umfrage aktualisieren?');
            setConfirmButtonText('Aktualisieren');
            setCancelButtonText("Abbrechen");
        } else {
            setModalTitle('Prüfe deine Eingaben!');
            setConfirmButtonText(undefined);
            setCancelButtonText(undefined);
        }
        setShowCloseButton(hasErrors());
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
                    {!icsStatus?.isValid && icsStatus?.url !== '' && <span className='red'><CalendarX className='icon red' />{" ICS-Link ist nicht gültig"}</span>}
                </>
            );
        }
        if (modalTitle === 'Prüfe deine Eingaben!') {
            return (
                <>
                    {title === '' && <p className='red'>Titel darf nicht leer sein</p>}
                    {participantsIds.length === 0 && <p className='red'>Es muss mindestens einen Teilnehmer geben</p>}
                    {(!proposedDates || proposedDates.length === 0) && <p className='red'>Es muss mindestens 1 Termin ausgewählt sein</p>}
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

    useEffect(() => {
        checkIcsStatus();
    }, []);

    function checkIcsStatus() {
        outlookService.checkIcsStatus()
            .then(status => {
                setIcsUrl(status.url);
                setIcsStatus({ isStored: status.stored, isValid: status.valid, url: status.url });
                console.log('ICS status:', status);
                if (status.stored && status.valid) {
                    outlookService.getIcsEvents()
                        .then(events => {
                            setIcsEvents(events);
                        })
                        .catch(error => {
                            console.error('Error fetching ICS events:', error);
                        });
                }
            })
            .catch(error => {
                console.error('Error checking ICS status:', error);
            });
    }

    return (
        <div className='app-body'>
            <div className='tab'>
                <h1>Umfrage erstellen
                    <div className='header-button-group'>
                    </div>
                </h1>
                <h3>Titel</h3>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Was ist der Anlass?" />
                <h3>Beschreibung</h3>
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Was muss man wissen?" />
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
                    icsEvents={icsEvents} />
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

export default Create;
