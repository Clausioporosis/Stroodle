import React, { useEffect, useState } from 'react';

import UserService from '../../../../services/UserService';
import { User } from '../../../../models/User';

import { X, People } from 'react-bootstrap-icons';

interface ParticipantProps {
    participantsIds: string[];
    removeSelectedParticipant: (participantId: string) => void;
}

const Participant: React.FC<ParticipantProps> = ({ participantsIds, removeSelectedParticipant }) => {
    const [participants, setParticipants] = useState<User[]>([]);

    useEffect(() => {
        const fetchParticipants = async () => {
            const usersPromises = participantsIds.map(id => UserService.getUserById(id));
            const users = (await Promise.all(usersPromises)).filter((user): user is User => user !== undefined);
            setParticipants(users);
        };

        fetchParticipants();
    }, [participantsIds]);

    const removeParticipant = (participantId: string) => {
        removeSelectedParticipant(participantId);
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

                            <X className='x-icon' onClick={() => removeParticipant(participant.id)} />

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