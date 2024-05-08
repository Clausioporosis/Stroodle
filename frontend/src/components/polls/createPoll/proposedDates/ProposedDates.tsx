import React from 'react';
import './ProposedDates.css';

import { ProposedDate } from '../../../../models/Poll';
import { Trash3 } from 'react-bootstrap-icons';

interface ProposedDatesProps {
    proposedDates: ProposedDate[];
}

const ProposedDates: React.FC<ProposedDatesProps> = ({ proposedDates }) => {
    const dateToTimesMap = proposedDates.reduce((accumulator: { [date: string]: { times: string[], weekday: string, dateFormatted: string } }, proposedDate) => {
        const dateString = new Date(proposedDate.date).toDateString();
        const weekday = new Date(proposedDate.date).toLocaleDateString('de-DE', { weekday: 'long' });
        const dateFormatted = new Date(proposedDate.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const hours = new Date(proposedDate.date).getHours().toString().padStart(2, '0');
        const minutes = new Date(proposedDate.date).getMinutes().toString().padStart(2, '0');
        const timeString = `${hours}:${minutes}`;

        if (!accumulator[dateString]) {
            accumulator[dateString] = { times: [timeString], weekday, dateFormatted };
        } else {
            accumulator[dateString].times.push(timeString);
        }

        return accumulator;
    }, {});

    return (
        <div className="proposed-dates-body">
            {Object.entries(dateToTimesMap).map(([date, { times, weekday, dateFormatted }], index) => (
                <div className='date-element' key={index}>
                    <div className='date'>
                        <p>{weekday}</p>
                        <p>{dateFormatted}</p>
                    </div>
                    <div className='time-list'>
                        {times.map((time, timeIndex) => (
                            <div className='Time' key={timeIndex}>{time} <Trash3 className='trash-icon' /></div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProposedDates;