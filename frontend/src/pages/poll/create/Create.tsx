import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import PollService from '../../../services/PollService';
import { Poll, ProposedDate } from '../../../models/Poll';

import SearchBar from '../../../components/polls/create/searchBar/SearchBar';
import AddedParticipants from '../../../components/polls/create/addedParticipants/AddedParticipants';
import WeekView from '../../../components/shared/weekView/WeekView';

import { useKeycloak } from '@react-keycloak/web';
import OutlookService from '../../../services/OutlookService';

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
    const [icsStatus, setIcsStatus] = useState<{ isStored: boolean, isValid: boolean } | undefined>();
    const [icsEvents, setIcsEvents] = useState<any[] | undefined>();

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
            pollService.putPoll(pollId, newPoll).then(() => {
                alert('Umfrage wurde erfolgreich geändert.');
                navigate('/dashboard');
            })
                .catch(error => {
                    alert('Es gab einen Fehler beim ändern der Umfrage. Bitte versuchen Sie es erneut.');
                    console.error('Es gab einen Fehler beim ändern der Umfrage:', error);
                });
        } else {
            pollService.createPoll(newPoll)
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
    }

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

    useEffect(() => {
        checkIcsStatus();
    }, []);

    function checkIcsStatus() {
        outlookService.checkIcsStatus()
            .then(status => {
                setIcsStatus({ isStored: status.stored, isValid: status.valid });
                if (status.stored && status.valid) {
                    outlookService.getIcsEvents()
                        .then(events => {
                            console.log('ICS events:', events);
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

    const handleIcsButtonClick = () => {
        if (icsStatus) {
            if (!icsStatus.isStored || !icsStatus.isValid) {
                const icsUrl = window.prompt('Bitte geben Sie die URL des ICS-Links ein:');
                if (icsUrl) {
                    outlookService.submitIcsUrl(icsUrl)
                        .then(() => {
                            checkIcsStatus();
                        })
                        .catch(error => {
                            console.error('Error saving ICS URL:', error);
                        });
                }
            }
        }
    };

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
                            {icsStatus ? (icsStatus.isStored ? (icsStatus.isValid ? 'ics gespeichert' : 'ics ungültig') : 'ics url speichern') : 'laden...'}
                        </button>

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
        </div>
    );
};

export default Create;
