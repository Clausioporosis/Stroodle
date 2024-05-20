import React, { useState, useEffect } from 'react';
import DateCard from '../dateCard/DateCard';
import UserInitials from '../../../shared//UserInitials';
import UserService from '../../../../services/UserService';
import { User } from '../../../../models/User';
import { ProposedDate } from '../../../../models/Poll';
import { Check2, X } from 'react-bootstrap-icons';
import { idText } from 'typescript';

interface VotingStatusProps {
    proposedDates?: ProposedDate[];
    participantIds?: string[];
    isOrganizer: boolean;
    selectedDateIndex: number | undefined;
    setSelectedDateIndex: (index: number | undefined) => void;
    votedDates: number[] | undefined;
    setVotedDates: (index: number[] | undefined) => void;
}

const VotingStatus: React.FC<VotingStatusProps> = ({ proposedDates, participantIds, isOrganizer, setSelectedDateIndex, selectedDateIndex, votedDates, setVotedDates }) => {
    const [users, setUsers] = useState<{ [key: string]: User }>({});

    useEffect(() => {
        const fetchUsers = async () => {
            const fetchedUsers: { [key: string]: User } = {};
            for (const id of participantIds || []) {
                const user = await UserService.getUserById(id);
                fetchedUsers[id] = user;
            }
            setUsers(fetchedUsers);
        };

        fetchUsers();
    }, [participantIds]);

    const getUserName = (id: string) => users[id]?.firstName + ' ' + users[id]?.lastName || '';

    function handleDateClick(index: number) {
        if (isOrganizer) {
            index === selectedDateIndex ? setSelectedDateIndex(undefined) : setSelectedDateIndex(index);
        } else {
            if (votedDates?.includes(index)) {
                setVotedDates(votedDates?.filter(i => i !== index));
            } else {
                setVotedDates([...(votedDates || []), index]);

            }
        }
    }


    return (
        <div className="grid">

            <div className="date-row">
                <div className="date-cell first-cell">Teilnehmer</div>

                {proposedDates?.map((date, index) => (
                    <div key={index} className="date-cell">
                        <DateCard
                            proposedDate={date}
                            isOrganizer={isOrganizer}
                            onDateClick={() => handleDateClick(index)}
                            isActive={isOrganizer ? index === selectedDateIndex : votedDates?.includes(index)} />
                    </div>
                ))}
            </div>

            {participantIds?.map(participantId => (

                <div key={participantId} className="voter-row">
                    <div className="voter-cell first-cell">
                        <UserInitials firstName={users[participantId]?.firstName} lastName={users[participantId]?.lastName} />
                        {getUserName(participantId)}
                    </div>

                    {proposedDates?.map((date, index) => (
                        <div key={index} className="voter-cell">
                            {date.voterIds && date.voterIds.includes(participantId) ? <Check2 className='icon' /> : <X className='icon' />}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default VotingStatus;