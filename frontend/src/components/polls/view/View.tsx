import React, { useEffect, useState, useRef } from 'react';
import Header from '../../common/header/Header';
import { useParams, useNavigate } from 'react-router-dom';

import PollService from '../../../services/PollService';
import { Poll } from '../../../models/Poll';
import UserService from '../../../services/UserService';
import { User } from '../../../models/User';

import VotingStatus from './votingStatus/VotingStatus';
import Card from '../../shared/infoCards/card/Card';

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

    function getPoll() {
        PollService.getPollById(pollId!)
            .then(poll => {
                setPoll(poll);
                setIsOrganizer(poll!.organizerId === UserService.getLoggedInUser().id);
                setSelectedDateIndex(poll?.bookedDateIndex);
                setIsBooked(poll?.bookedDateIndex === null ? false : true);

                // has to be rewritten in separate function
                const votedDates: number[] = [];
                poll?.proposedDates?.forEach((date, index) => {
                    if (date.voterIds?.includes(UserService.getLoggedInUser().id)) {
                        votedDates.push(index);
                    }
                });
                setVotedDates(votedDates);
            })
            .catch(error => {
                console.error('Es gab einen Fehler beim Abrufen des Polls!', error);
            });
    }

    function handleButtonClick() {
        if (!poll?.organizerId) return;

        let updatedPoll = { ...poll };
        updatedPoll.bookedDateIndex = selectedDateIndex;

        const userId = UserService.getLoggedInUser().id;

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
        PollService.putPoll(updatedPoll.id || '', updatedPoll);

        //temp solution, because card state is not updating
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

    return (
        <div className='app'>
            <Header />
            <div className='app-body'>
                <div className='tab single-tab grow-tab'>

                    {isOrganizer ? (
                        <h1>Deine Umfrage
                            <div className='header-button-group'>
                                <button className="header-button" onClick={() => navigate(-1)}>Zurück</button>
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
                        <h1>Termine Auswählen
                            <div className='header-button-group'>
                                <button className="header-button" onClick={() => navigate(-1)}>Zurück</button>
                                <button className="header-button" onClick={handleButtonClick} disabled={!hasEdited}>Auswahl speichern</button>
                            </div>
                        </h1>
                    )}


                    {poll && <Card useCase={'runningPolls'} poll={poll} />}

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
                                participantIds={poll.participantIds}
                                isOrganizer={isOrganizer}
                                votedDates={votedDates}
                                setVotedDates={setVotedDates}
                            />}
                        </div>
                    }


                </div>
            </div>
        </div>

    );
};

export default View;