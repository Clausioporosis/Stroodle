import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import React, { useEffect, useState } from 'react';
import { Calendar } from '@fullcalendar/core';

import UserService from '../../../services/UserService';
import { User, Availability } from '../../../models/User';

interface WeekViewProps {
    useCase: string;
    availability?: Availability;
}

const WeekView: React.FC<WeekViewProps> = ({ useCase, availability }) => {
    const [allDaySlot, setAllDaySlot] = useState<boolean>();
    const [nowIndicator, setNowIndicator] = useState<boolean>();
    const [selectable, setSelectable] = useState<boolean>();
    const [headerToolbar, setHeaderToolbar] = useState<any>();

    const [calenderEvents, setCalenderEvents] = useState<any[]>([]);

    useEffect(() => {
        calenderSettings(useCase);
        availabilityToEvents();
    }, []);

    function availabilityToEvents() {

        for (const day in availability) {
            console.log(day);
        }
    };

    const calenderSettings = (useCase: string) => {
        if (useCase === 'availability') {
            setAllDaySlot(false);
            setNowIndicator(false);
            setSelectable(true);
            setHeaderToolbar(false);
        } else if (useCase === 'poll') {
            setHeaderToolbar({
                left: 'prev,next,today,duration',
                center: 'title',
                right: ''
            });
        }
    };

    const setAvailabilityHighlight = (calendar: Calendar) => {

    }

    const handleCalenderSelect = (info: any) => {
        if (selectable) {
            const start = info.start;
            const end = info.end;

            console.log('Start date: ' + start);
            console.log('End date: ' + end);
        }
    };

    const handleCalenderClick = (info: any) => {
        if (!selectable) {
            const start = info.start;

            console.log('Clicked date: ' + start);
        }
    };

    return (
        <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            height={'100%'}
            firstDay={1}
            allDaySlot={allDaySlot}
            nowIndicator={nowIndicator}
            locale={'de'}

            headerToolbar={headerToolbar}


            dayHeaderFormat={{
                weekday: 'long'
            }}

            eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            }}

            snapDuration="00:05:00"
            selectable={selectable}
            dateClick={handleCalenderClick}
            select={handleCalenderSelect}
        />
    );
};

export default WeekView;