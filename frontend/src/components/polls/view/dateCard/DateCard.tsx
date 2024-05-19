import React from 'react';
import { ProposedDate } from '../../../../models/Poll';
import { start } from 'repl';

const DateCard: React.FC<{ proposedDate?: ProposedDate }> = ({ proposedDate }) => {
    const date = new Date(proposedDate!.date);
    const isAllDay = proposedDate!.duration === 'allDay';
    const duration = isAllDay ? 'Ganztägig' : `${proposedDate!.duration} Minuten`;
    const weekday = date.toLocaleString('de-DE', { weekday: 'long' });
    const month = date.toLocaleString('de-DE', { month: 'long' });
    const day = date.getDate();
    const year = date.getFullYear();
    let startTime = null;
    let endTime = null;

    if (!isAllDay) {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        startTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

        date.setMinutes(date.getMinutes() + Number(proposedDate!.duration));

        hours = date.getHours();
        minutes = date.getMinutes();

        endTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    return (
        <div className='date-card-component'>
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
        </div>
    );
};

export default DateCard;