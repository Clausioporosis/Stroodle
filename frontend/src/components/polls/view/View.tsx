import React, { useEffect } from 'react';
import Header from '../../common/header/Header';
import { useParams } from 'react-router-dom';

import PollService from '../../../services/PollService';
import { Poll } from '../../../models/Poll';
import UserService from '../../../services/UserService';
import { User } from '../../../models/User';

import VotingStatus from './votingStatus/VotingStatus';

const View: React.FC = () => {
    const { pollId } = useParams<{ pollId: string }>();
    const [poll, setPoll] = React.useState<Poll>();
    const [organizer, setOrganizer] = React.useState<User>();

    useEffect(() => {
        getPoll();
    }, []);

    function getPoll() {
        PollService.getPollById(pollId!)
            .then(poll => {
                setPoll(poll);
                getUser(poll!.organizerId);
            })
            .catch(error => {
                console.error('Es gab einen Fehler beim Abrufen des Polls!', error);
            });
    }

    function getUser(organizerId: string) {
        UserService.getUserById(organizerId)
            .then(user => {
                setOrganizer(user);
            })
            .catch(error => {
                console.error('Es gab einen Fehler beim Abrufen des Benutzers!', error);
            });
    }

    return (
        <div className='app'>
            <Header />
            <div className='app-body'>
                <div className='content-tab'>
                    <div className='tab-item'>


                        <div className="poll-details">
                            {poll && <VotingStatus proposedDates={poll.proposedDates} participantIds={poll.participantIds} />}
                        </div>















                        {/* proposed dates row
                        <div className='grid-container'>

                            <div className='grid-item' key='empty-cell'>Namen</div>

                            {poll?.proposedDates?.map((proposedDate, index) => (

                                <div className='grid-item' key={`date-${index}`}>
                                    {new Date(proposedDate.date).toLocaleDateString()}
                                </div>

                            ))}
                        </div>
                        */}
                        {/* organizer row
                        <div className='grid-container'>

                            <div className='grid-item first' key='organizer-row'>{poll?.organizerId}</div>

                            {poll?.proposedDates?.map((proposedDate, index) => (
                                <div className='grid-item' key={`organizer-row-${index}`}>
                                    checked
                                </div>
                            ))}
                        </div>
                         */}
                        {/* participants row 
                        {poll?.participantIds?.map((participantId, index) => (
                            <div className='grid-container' key={`participant-row-${index}`}>

                                <div className='grid-item first'>{participantId}</div>

                                {poll?.proposedDates?.map((proposedDate, index) => (
                                    <div className='grid-item' key={`participant-${index}-${proposedDate.date}`}>
                                        voted?
                                    </div>
                                ))}
                            </div>
                        ))}
                        */}
                    </div>
                </div>
            </div>
        </div>

    );
};

export default View;