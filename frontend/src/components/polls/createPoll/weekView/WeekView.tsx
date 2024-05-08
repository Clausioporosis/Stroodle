import React, { useState, useEffect } from 'react';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import { ProposedDate, Poll } from '../../../../models/Poll';

interface ProposedDateProps {
    proposedDates: ProposedDate[];
    duration: string;
}

interface FullCalendarEvent {
    start: Date;
    end: Date;
    title?: string;
    display?: string;
    color: string;
}

const WeekView: React.FC<ProposedDateProps> = ({ proposedDates, duration }) => {

    useEffect(() => {

        const passedEvents = {
            start: new Date(0, 0, 0),
            end: new Date(),
            display: 'background',
            color: '#ddd'
        };


    }, []);
    const handleDateClickt = (info: any) => {
        proposedDates.push(info.dateStr);
        console.log(proposedDates);
    };

    const handleDateClick = (selectedDate: any) => {
        const currentDate = new Date();
        const selectedDateObject = new Date(selectedDate.dateStr);

        if (selectedDateObject >= currentDate) {
            const newProposedDate = new ProposedDate(selectedDate.dateStr, '');
            //setProposedDates(prevProposedDates => [...prevProposedDates, newProposedDate]);
        } else {
            alert('Noch gibt es keine Zeitreisen. Bitte wähle ein Datum in der Zukunft.');
        }
    };

    const proposedDatesForCalendar = proposedDates.map(proposedDate => {
        const endDate = new Date(proposedDate.date);
        endDate.setMinutes(endDate.getMinutes() + Number(duration));
        return {
            start: proposedDate.date,
            end: endDate,
            title: '',
        };
    });

    return (
        <div className='week-view-component'>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                height={'100%'}
                firstDay={1}
                allDaySlot={false}
                nowIndicator={true}

                snapDuration="00:05:00"
                slotMinTime="00:00"
                slotMaxTime="24:00"
                slotLabelFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}

                dateClick={handleDateClick}
                events={proposedDatesForCalendar}
            />
        </div>
    );
};

export default WeekView;