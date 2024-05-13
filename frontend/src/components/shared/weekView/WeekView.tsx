import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import React, { useEffect, useState } from 'react';
import { Calendar } from '@fullcalendar/core';

import UserService from '../../../services/UserService';
import { User, Availability, Weekday, TimePeriod } from '../../../models/User';

interface WeekViewProps {
    useCase: string;
    userAvailability?: Availability;
    updateUserAvailability?: (day: Weekday, start: string, end: string) => void;
}

interface CalenderEvent {
    display: string;
    color: string;
    title?: string;
    start?: Date;
    startTime?: string;
    end?: Date;
    endTime?: string;
    daysOfWeek?: number[];
    allDay?: boolean;
}

const WeekView: React.FC<WeekViewProps> = ({ useCase, userAvailability, updateUserAvailability }) => {
    const [allDaySlot, setAllDaySlot] = useState<boolean>();
    const [nowIndicator, setNowIndicator] = useState<boolean>();
    const [selectable, setSelectable] = useState<boolean>();
    const [headerToolbar, setHeaderToolbar] = useState<any>();

    const [calenderEvents, setCalenderEvents] = useState<CalenderEvent[]>([]);

    useEffect(() => {
        calenderSettings(useCase);
    }, []);

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

    useEffect(() => {
        if (userAvailability) {
            availabilityToEvents();
        }
    }, [userAvailability]);

    function availabilityToEvents() {
        setCalenderEvents([]);
        for (let day in userAvailability) {
            let timeslots = userAvailability[day as Weekday];

            timeslots?.forEach((time: TimePeriod) => {
                const values = Object.values(Weekday);
                const weekDayIndex = values.indexOf(day as Weekday);

                let availabilityOfWeekday: CalenderEvent = {
                    display: 'background',
                    color: 'red',
                    startTime: time.start,
                    endTime: time.end,
                    daysOfWeek: [weekDayIndex],
                    allDay: false
                }
                addEventToCalender(availabilityOfWeekday);
            });
        }
    };

    function addEventToCalender(newEvent: CalenderEvent) {
        /*
        setCalenderEvents(prevEvents => {
            if (!prevEvents.some(event => event.startTime === newEvent.startTime && event.endTime === newEvent.endTime)) {
                return [...prevEvents, newEvent];
            } else {
                return prevEvents;
            }
            
        });
        */
        setCalenderEvents(prevEvents => [...prevEvents, newEvent]);

    }

    const handleCalenderSelect = (info: any) => {
        const weekdayIndex = info.start.getDay();
        const weekday = Object.values(Weekday)[weekdayIndex];
        const startTime = info.start.toLocaleTimeString();
        const endTime = info.end.toLocaleTimeString();

        let newAvailability: CalenderEvent = {
            display: 'background',
            color: 'red',
            startTime: startTime,
            endTime: endTime,
            daysOfWeek: [weekdayIndex],
            allDay: false
        }
        updateUserAvailability?.(weekday, startTime, endTime);
        addEventToCalender(newAvailability);
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

            // only allow selection within the same day
            selectAllow={
                function (selectInfo) {
                    var startDay = selectInfo.start.getDay();
                    var endDay = selectInfo.end.getDay();
                    return startDay === endDay;
                }}

            dateClick={handleCalenderClick}
            select={handleCalenderSelect}

            events={calenderEvents}
        />
    );
};

export default WeekView;