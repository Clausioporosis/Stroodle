import React, { useState, useEffect } from 'react';
import DateCard from '../dateCard/DateCard';
import UserInitials from '../../../shared/userInitals/UserInitials';
import { User } from '../../../../models/User';
import { ProposedDate } from '../../../../models/Poll';
import { Check2, X } from 'react-bootstrap-icons';

import { Availability, Weekday } from '../../../../models/User';
import UserService from '../../../../services/UserService';
import OutlookService from '../../../../services/OutlookService';

import { useKeycloak } from "@react-keycloak/web";

interface VotingStatusProps {
    setHasEdited: (hasEdited: boolean) => void;
    proposedDates?: ProposedDate[];
    participantIds?: string[];
    isOrganizer: boolean;
    selectedDateIndex: number | undefined;
    setSelectedDateIndex: (index: number | undefined) => void;
    votedDates: number[] | undefined;
    setVotedDates: (index: number[] | undefined) => void;
    icsEvents?: any[]; // Add icsEvents to props
}

const VotingStatus: React.FC<VotingStatusProps> = ({ setHasEdited, proposedDates, participantIds, isOrganizer, setSelectedDateIndex, selectedDateIndex, votedDates, setVotedDates, icsEvents }) => {
    const [users, setUsers] = useState<{ [key: string]: User }>({});
    const [mostVotedDates, setMostVotedDates] = useState<number[]>([]);
    const [userAvailability, setUserAvailability] = useState<Availability | undefined>(undefined);
    const [availableDates, setAvailableDates] = useState<number[]>([]);
    const [conflictingDates, setConflictingDates] = useState<number[]>([]);

    const { keycloak } = useKeycloak();
    const userService = new UserService(keycloak);
    const outlookService = new OutlookService(keycloak);

    useEffect(() => {
        const fetchUserAvailability = async () => {
            const availability = await userService.getUserAvailability(keycloak.tokenParsed?.sub!);
            setUserAvailability(availability);
        };
        fetchUserAvailability();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            const fetchedUsers: { [key: string]: User } = {};
            for (const id of participantIds || []) {
                const user = await userService.getUserById(id);
                if (user) fetchedUsers[id] = user;
            }
            setUsers(fetchedUsers);
        };

        fetchUsers();
    }, [participantIds]);

    const getUserName = (id: string) => users[id]?.firstName + ' ' + users[id]?.lastName || '';

    const checkOverlap = (date: ProposedDate): boolean => {
        if (!userAvailability) return false;

        const dateObj = new Date(date.date);
        const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase() as Weekday;
        const time = dateObj.toTimeString().split(' ')[0];

        const dayAvailability = userAvailability[dayOfWeek] || [];

        return dayAvailability.some(slot => time >= slot.start && time <= slot.end);
    };

    const checkIcsConflict = (date: ProposedDate): boolean => {
        if (!icsEvents) return false;

        const dateStart = new Date(date.date);
        const dateEnd = new Date(dateStart.getTime() + Number(date.duration) * 60000);

        return icsEvents.some((event: any) => {
            const eventStart = new Date(event.start);
            const eventEnd = new Date(event.end);
            return (dateStart < eventEnd && dateEnd > eventStart);
        });
    };

    function handleDateClick(index: number) {
        setHasEdited(true);
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

    useEffect(() => {
        const availableDatesIndices = proposedDates?.map((date, index) => checkOverlap(date) ? index : -1).filter(index => index !== -1);
        setAvailableDates(availableDatesIndices || []);

        const conflictingDatesIndices = proposedDates?.map((date, index) => checkIcsConflict(date) ? index : -1).filter(index => index !== -1);
        setConflictingDates(conflictingDatesIndices || []);
    }, [proposedDates, userAvailability, icsEvents]);

    useEffect(() => {
        const maxVotes = Math.max(...(proposedDates?.map(date => date.voterIds.length) || [0]));
        const mostVotedDates = proposedDates?.map((date, index) => date.voterIds.length === maxVotes ? index : -1).filter(index => index !== -1);
        setMostVotedDates(mostVotedDates || []);
    }, [proposedDates]);


    return (
        <div className="grid">
            <div className="date-row">
                <div className="date-cell first-cell">
                    <div className='participants'>
                        <p>Teilnehmer</p>
                    </div>
                </div>
                {proposedDates?.map((date, index) => (
                    <div key={index} className="date-cell">
                        <DateCard
                            proposedDate={date}
                            isOrganizer={isOrganizer}
                            onDateClick={() => handleDateClick(index)}
                            isActive={isOrganizer ? index === selectedDateIndex : votedDates?.includes(index)}
                            isMostVotedDate={mostVotedDates.includes(index)}
                            matchesAvailability={availableDates.includes(index)}
                            matchesIcsEvent={conflictingDates.includes(index)}
                        />
                    </div>
                ))}
            </div>

            {participantIds?.map(participantId => (
                <div key={participantId} className="voter-row">
                    <div className="voter-cell first-cell">
                        <div className='first-cell-bg'>
                            <UserInitials firstName={users[participantId]?.firstName} lastName={users[participantId]?.lastName} size={30} border={'none'} />
                            {getUserName(participantId)}
                        </div>
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
