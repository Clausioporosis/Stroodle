import React, { useEffect, useState } from 'react';
import Header from '../../common/header/Header';
import { useParams } from 'react-router-dom';

import PollService from '../../../services/PollService';
import { Poll } from '../../../models/Poll';
import UserService from '../../../services/UserService';
import { User } from '../../../models/User';

import VotingStatus from './votingStatus/VotingStatus';
import Card from '../../shared/infoCards/card/Card';

const View: React.FC = () => {
    const { pollId } = useParams<{ pollId: string }>();
    const [poll, setPoll] = useState<Poll>();
    const [selectedDateIndex, setSelectedDateIndex] = useState<number | undefined>();
    const [isBooked, setIsBooked] = useState<boolean>(false);
    const [votedDates, setVotedDates] = useState<number[] | undefined>();
    const [isOrganizer, setIsOrganizer] = useState<boolean>(false);

    useEffect(() => {
        getPoll();
    }, []);

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
        PollService.putPoll(updatedPoll);

        //temp solution, because card state is not updating
        window.location.reload();
    }

    function handleReopenClick() {
        setIsBooked(false);
    }

    return (
        <div className='app'>
            <Header />
            <div className='app-body'>
                <div className='content-tab'>

                    {isOrganizer ? (
                        <h1>Deine Umfrage
                            <div className='header-button-group'>
                                <button className="header-button" onClick={handleReopenClick}>Buchung Bearbeiten</button>
                                <button className="header-button" onClick={handleButtonClick}>Termin Buchen</button>
                            </div>
                        </h1>
                    ) : (
                        <h1>Termine Auswählen
                            <div className='header-button-group'>
                                <button className="header-button" onClick={handleButtonClick}>Auswahl Speichern</button>
                            </div>
                        </h1>
                    )}


                    {poll && <Card useCase={'runningPolls'} poll={poll} />}

                    {!isBooked &&
                        <div className="poll-details">
                            {poll && <VotingStatus
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