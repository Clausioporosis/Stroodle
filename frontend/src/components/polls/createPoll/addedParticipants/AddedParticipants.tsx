import React from 'react';
import './AddedParticipants.css';

import { User } from '../../../../models/User';

import { X, People } from 'react-bootstrap-icons';

interface ParticipantProps {
    participants: User[];
    removeSelectedParticipant: (user: User) => void;
}

const Participant: React.FC<ParticipantProps> = ({ participants, removeSelectedParticipant }) => {
    const removeParticipant = (participant: User) => {
        removeSelectedParticipant(participant);
    };

    return (
        <div className='added-participants-body'>
            {participants.length > 0 ? (
                participants.map((participant, index) => {
                    const initials = participant.firstName[0] + participant.lastName[0];
                    return (

                        <div key={index} className='participant-body'>

                            <div className='participant-icon'>
                                <span className='participant-initials'>
                                    {initials.toUpperCase()}
                                </span>
                            </div>


                            <div className='participant-info'>
                                <span className='participant-name'>
                                    {participant.firstName} {participant.lastName}
                                </span>
                                <span className='participant-email'>
                                    {participant.email}
                                </span>
                            </div>

                            <X className='x-icon' onClick={() => removeParticipant(participant)} />

                        </div>
                    );
                })
            ) : (
                <div className='no-participants'>
                    <People size={32} />
                    <p>Eingeladene Personen werden</p>
                    <p>hier anngezeigt.</p>
                </div>
            )}
        </div>
    );
}

export default Participant;