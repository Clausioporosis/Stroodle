import React from 'react';
import { ProposedDate } from '../../../../models/Poll';
import { People, Star, StarFill } from 'react-bootstrap-icons';

interface DateCardProps {
    proposedDate?: ProposedDate;
    isOrganizer: boolean;
    isActive?: boolean;
    onDateClick: () => void;
}

const DateCard: React.FC<DateCardProps> = ({ proposedDate, isOrganizer, onDateClick, isActive = false }) => {
    const formatTime = (date: Date) => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };

    const calculateEndTime = (date: Date, duration: number) => {
        const endDate = new Date(date.getTime() + duration * 60000);
        return formatTime(endDate);
    };

    const formatDate = (proposedDate: ProposedDate) => {
        const date = new Date(proposedDate.date);
        const isAllDay = proposedDate.duration === 'allDay';
        const duration = isAllDay ? 'Ganztägig' : `${proposedDate.duration} Minuten`;
        const weekday = date.toLocaleString('de-DE', { weekday: 'long' });
        const month = date.toLocaleString('de-DE', { month: 'long' });
        const day = date.getDate();
        const year = date.getFullYear();
        let startTime = null;
        let endTime = null;

        if (!isAllDay) {
            startTime = formatTime(date);
            endTime = calculateEndTime(date, Number(proposedDate.duration));
        }

        return { weekday, month, day, year, startTime, endTime, duration, isAllDay };
    };

    const { weekday, month, day, year, startTime, endTime, duration, isAllDay } = formatDate(proposedDate!);


    return (
        <div className='date-card-component' onClick={onDateClick}>
            <p>{weekday}</p>
            <p>{day}</p>
            <p>{month}</p>
            {!isAllDay &&
                <div className='time'>
                    <p>&nbsp;&nbsp;{startTime} Uhr</p>
                    <p>- {endTime} Uhr</p>
                </div>
            }
            <p>{duration}</p>

            {isOrganizer ? (
                isActive ? (
                    <StarFill />
                ) : (
                    <Star />
                )
            ) : (
                <input type="checkbox" id="myCheckbox" name="myCheckbox" checked={isActive} onChange={() => {/*leer um react error zu umgehen*/ }} />
            )}

            <p><People className='icon' />{'voters'}</p>
        </div>
    );
};

export default DateCard;