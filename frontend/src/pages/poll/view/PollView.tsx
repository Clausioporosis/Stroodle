import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import PollService from '../../../services/PollService';
import { Poll } from '../../../models/Poll';

import VotingStatus from '../../../components/polls/view/votingStatus/VotingStatus';
import Card from '../../../components/shared/infoCards/card/Card';
import Modal from '../../../components/shared/modal/Modal'; // Import Modal component

import { CalendarX, CalendarCheck, CalendarPlus } from 'react-bootstrap-icons'; // Import icons
import { useKeycloak } from "@react-keycloak/web";

import OutlookService from '../../../services/OutlookService'; // Import OutlookService

const View: React.FC = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { pollId } = useParams<{ pollId: string }>();
    const navigate = useNavigate();

    const [poll, setPoll] = useState<Poll>();
    const [selectedDateIndex, setSelectedDateIndex] = useState<number | undefined>();

    const [hasEdited, setHasEdited] = useState<boolean>(false);

    const [isBooked, setIsBooked] = useState<boolean>(false);
    const [votedDates, setVotedDates] = useState<number[] | undefined>();
    const [isOrganizer, setIsOrganizer] = useState<boolean>(false);

    const { keycloak } = useKeycloak();
    const pollService = new PollService(keycloak);

    const [isModalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState<string>('');
    const [confirmButtonText, setConfirmButtonText] = useState<string | undefined>(undefined);
    const [showCloseButton, setShowCloseButton] = useState<boolean>(true);
    const [cancelButtonText, setCancelButtonText] = useState<string | undefined>();
    const [icsUrl, setIcsUrl] = useState<string>('');
    const [customDuration, setCustomDuration] = useState('');
    const [icsStatus, setIcsStatus] = useState<{ isStored: boolean, isValid: boolean, url: string } | undefined>();
    const [icsEvents, setIcsEvents] = useState<any[] | undefined>();

    const outlookService = new OutlookService(keycloak); // Initialize OutlookService

    useEffect(() => {
        getPoll();
    }, []);

    useEffect(() => {
        if (isOrganizer) {
            if (poll?.bookedDateIndex === null && selectedDateIndex === undefined && hasEdited || poll?.bookedDateIndex === selectedDateIndex) {
                setHasEdited(false);
            }
        }
    }, [hasEdited, selectedDateIndex, votedDates]);

    useEffect(() => {
        checkIcsStatus();
    }, []);

    function getPoll() {
        pollService.getPollById(pollId!)
            .then(poll => {
                setPoll(poll);
                const currentUserId = keycloak.tokenParsed?.sub!;
                const isOrganizer = poll!.organizerId === currentUserId;
                setIsOrganizer(isOrganizer);
                setSelectedDateIndex(poll?.bookedDateIndex);
                setIsBooked(poll?.bookedDateIndex !== null);

                const votedDates: number[] = [];
                poll?.proposedDates?.forEach((date, index) => {
                    if (date.voterIds?.includes(currentUserId)) {
                        votedDates.push(index);
                    }
                });
                setVotedDates(votedDates);

                if (!poll!.participantIds.includes(currentUserId) && !isOrganizer) {
                    poll!.participantIds.push(currentUserId);
                    setPoll({ ...poll! });
                    pollService.putPoll(poll!.id || '', poll!);
                }
            })
            .catch(error => {
                console.error('Es gab einen Fehler beim Abrufen des Polls!', error);
            });
    }

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

    const handleIcsButtonClick = () => {
        setModalOpen(true);
        setModalTitle('Kalender verknüpfen');
        setConfirmButtonText('Speichern');
        setCancelButtonText("Abbrechen");
        setShowCloseButton(false);
    };

    const handleIcsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIcsUrl(event.target.value);
    };

    const handleCustomDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCustomDuration(event.target.value);
    };

    const handleConfirm = () => {
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
        setModalOpen(false);
    };

    const handleCancel = () => {
        setModalOpen(false);
    };

    const renderModalContent = () => {
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
        return null;
    };

    function handleButtonClick() {
        if (!poll?.organizerId) return;

        let updatedPoll = { ...poll };
        updatedPoll.bookedDateIndex = selectedDateIndex;

        const userId = keycloak.tokenParsed?.sub!;

        updatedPoll.proposedDates?.forEach((date, index) => {
            if (!date.voterIds) {
                date.voterIds = [];
            }

            if (votedDates?.includes(index)) {
                if (!date.voterIds.includes(userId)) {
                    date.voterIds.push(userId);
                }
            } else {
                if (date.voterIds.includes(userId)) {
                    date.voterIds = date.voterIds.filter(id => id !== userId);
                }
            }
        });

        setPoll(updatedPoll);
        pollService.putPoll(updatedPoll.id || '', updatedPoll);

        window.location.reload();
    }

    function handleReopenClick() {
        setIsBooked(false);
    }

    const scrollLeft = () => {
        scrollRef.current!.scrollTo({
            left: scrollRef.current!.scrollLeft - 100,
            behavior: 'smooth'
        });
    };

    const scrollRight = () => {
        scrollRef.current!.scrollTo({
            left: scrollRef.current!.scrollLeft + 100,
            behavior: 'smooth'
        });
    };

    const [isOverflowing, setIsOverflowing] = useState(false);

    useEffect(() => {
        const checkOverflow = () => {
            if (scrollRef.current) {
                setIsOverflowing(scrollRef.current.scrollWidth > scrollRef.current.clientWidth);
            }
        };

        checkOverflow();

        const observer = new MutationObserver(checkOverflow);
        if (scrollRef.current) {
            observer.observe(scrollRef.current, { childList: true, subtree: true });
        }

        window.addEventListener('resize', checkOverflow);

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', checkOverflow);
        };
    }, []);

    function getOrganizerButtonText() {
        if (poll?.bookedDateIndex && selectedDateIndex === undefined) {
            return 'Wieder eröffnen';
        } else if (poll?.bookedDateIndex === null) {
            return 'Termin buchen';
        } else if (poll?.bookedDateIndex !== selectedDateIndex || poll?.bookedDateIndex === selectedDateIndex) {
            return 'Termin ändern';
        }
        return 'Error?';
    }

    const currentUserId = keycloak.tokenParsed?.sub;
    const sortedParticipantIds = currentUserId ? [currentUserId, ...(poll?.participantIds?.filter(id => id !== currentUserId) || [])] : poll?.participantIds;

    return (
        <div className='app-body'>
            <div className='tab single-tab grow-tab'>

                {isOrganizer ? (
                    <h1>{isBooked ? 'Termin gebucht' : 'Termin buchen'}
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

                            {(!isBooked) ? (
                                <button className="header-button" onClick={handleButtonClick} disabled={!hasEdited}>
                                    {getOrganizerButtonText()}
                                </button>
                            ) : (
                                <button className="header-button" onClick={handleReopenClick}>Bearbeiten</button>
                            )}
                        </div>
                    </h1>
                ) : (
                    <h1> {isBooked ? 'Termin Informationen' : 'Verfügbarkeit auswählen'}
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

                            {!isBooked && <button className="header-button" onClick={handleButtonClick} disabled={!hasEdited}>Auswahl speichern</button>}
                        </div>
                    </h1>
                )}


                {poll && <Card useCase={'runningPolls'} poll={poll} viewCard={true} />}

                {isOverflowing && (
                    <div className='scroll-buttons'>
                        <p>Weitere Termine verfügbar!</p>
                        <button onClick={scrollLeft}>{'<<'}</button>
                        <button onClick={scrollRight}>{'>>'}</button>
                    </div>
                )}

                {!isBooked &&
                    <div className="poll-details" ref={scrollRef}>
                        {poll && <VotingStatus
                            setHasEdited={setHasEdited}
                            setSelectedDateIndex={setSelectedDateIndex}
                            selectedDateIndex={selectedDateIndex}
                            proposedDates={poll.proposedDates}
                            participantIds={isOrganizer ? poll?.participantIds : sortedParticipantIds}
                            isOrganizer={isOrganizer}
                            votedDates={votedDates}
                            setVotedDates={setVotedDates}
                            icsEvents={icsEvents} // Pass icsEvents to VotingStatus
                        />}
                    </div>
                }

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
        </div>
    );
};

export default View;