import FullCalendar from '@fullcalendar/react';
import EventClickArg from '@fullcalendar/react';
import DateSelectArg from '@fullcalendar/react';

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import React, { useEffect, useState } from 'react';
import { Calendar } from '@fullcalendar/core';


import UserService from '../../../services/UserService';
import { User, Availability, Weekday, TimePeriod } from '../../../models/User';
import DurationSelect from './durationSelect/DurationSelect';
import { Console } from 'console';

interface WeekViewProps {
    useCase: string;
    userAvailability?: Availability;
    addAvailabilityEntry?: (day: Weekday, start: string, end: string) => void;
    removeAvailability?: (isPending: Boolean, day: Weekday, start: string, end: string) => void;
    setSelectedDuration?: React.Dispatch<React.SetStateAction<string>>;
}

interface CalenderEvent {
    id?: string;
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

const WeekView: React.FC<WeekViewProps> = ({ useCase, userAvailability, addAvailabilityEntry, removeAvailability, setSelectedDuration }) => {
    const [allDaySlot, setAllDaySlot] = useState<boolean>();
    const [nowIndicator, setNowIndicator] = useState<boolean>();
    const [selectable, setSelectable] = useState<boolean>();
    const [headerToolbar, setHeaderToolbar] = useState<any>();

    const [calenderEvents, setCalenderEvents] = useState<CalenderEvent[]>([]);

    // new test code with api -------------------------------------------------------------------------------------------
    const [calendarApi, setCalendarApi] = useState<any>(null);
    const calendarRef = React.useRef<FullCalendar>(null);

    useEffect(() => {
        if (calendarRef.current) {
            setCalendarApi(calendarRef.current.getApi());
        }
    }, []);

    function refTest(): void {
        if (calendarApi) {
            const events: any = calendarApi.getEvents();

            console.log(events);
        }
    }

    function handleCalenderSelection(selection: DateSelectArg): void {
        if (calendarApi) {
            console.log(selection);
            /*
            let newAvailability: CalenderEvent = {
                id: weekday + startTime,
                display: 'background',
                color: 'green',
                startTime: startTime,
                endTime: endTime,
                daysOfWeek: [weekdayIndex],
                allDay: false
            }
            */
        }
    }
    // ------------------------------------------------------------------------------------------------------------------


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
            setAllDaySlot(true);
            setNowIndicator(true);
            setSelectable(false);
            setHeaderToolbar({
                left: 'prev,next,today,duration',
                center: 'title',
                right: ''
            });
        }
    };

    function addEventToCalender(newEvent: CalenderEvent) {
        setCalenderEvents(prevEvents => [...prevEvents, newEvent]);
        refTest();
    }

    function handleEventDelete(event: any) {
        // remove event from calendar
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            const eventToRemove = calendarApi.getEventById(event.id);
            eventToRemove?.remove();
        }

        const dayIndex = event.start.getDay();
        const day = Object.values(Weekday)[dayIndex];
        // adjust time to UTC... this is really awful and should be considered next time
        const adjustTime = (date: Date) => new Date(date.getTime() + 2 * 60 * 60 * 1000).toISOString();
        const startTime = adjustTime(event.start).split('T')[1].slice(0, -5);
        const endTime = adjustTime(event.end).split('T')[1].slice(0, -5);
        let isPending = event.backgroundColor === 'green';

        // remove event from userAvailability
        removeAvailability?.(isPending, day, startTime, endTime);
    }

    function renderEventContent(eventClickInfo: EventClickArg) {
        // @ts-ignore
        const event = eventClickInfo.event; // unreasonable error: 'event' object does exist!
        let isPending = event.backgroundColor === 'green';
        return (
            <>
                <button onClick={() => handleEventDelete(event)}>
                    X
                </button>
            </>
        );
    }

    // poll logic --------------------------------------------------------------------------------------------

    const handleCalenderClick = (info: any) => {
        const start = info.dateStr;

        console.log('Clicked date: ' + start);
        let newDate: CalenderEvent = {
            id: start,
            display: 'event',
            color: 'green',
            start: start,
        };

        addEventToCalender(newDate);
    }

    // availability logic --------------------------------------------------------------------------------------------

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
                    id: day + time.start,
                    display: 'background',
                    color: '#4C9EBC',
                    startTime: time.start,
                    endTime: time.end,
                    daysOfWeek: [weekDayIndex],
                    allDay: false
                }
                addEventToCalender(availabilityOfWeekday);
            });
        }
    };

    const handleCalenderSelect = (info: any) => {
        const weekdayIndex = info.start.getDay();
        const weekday = Object.values(Weekday)[weekdayIndex];
        const startTime = info.start.toLocaleTimeString();
        const endTime = info.end.toLocaleTimeString();

        let newAvailability: CalenderEvent = {
            id: weekday + startTime,
            display: 'background',
            color: 'green',
            startTime: startTime,
            endTime: endTime,
            daysOfWeek: [weekdayIndex],
            allDay: false
        }

        addEventToCalender(newAvailability);
        addAvailabilityEntry?.(weekday, startTime, endTime);
        info.view.calendar.unselect();
    };

    return (
        <div className='tab-item'>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                ref={calendarRef}
                initialView="timeGridWeek"
                height={'100%'}
                firstDay={1}
                allDaySlot={allDaySlot}
                locale={'de'}
                events={calenderEvents}
                headerToolbar={headerToolbar}


                dayHeaderFormat={{
                    weekday: 'long'
                }}

                eventTimeFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                }}

                snapDuration="00:15:00"
                selectable={selectable}
                // only allow selection within the same day and at least 30 minutes
                selectAllow={
                    function (selectInfo) {
                        var startDay = selectInfo.start.getDay();
                        var endDay = selectInfo.end.getDay();
                        var duration = (selectInfo.end.getTime() - selectInfo.start.getTime()) / 1000 / 60;

                        return startDay === endDay && duration >= 30;
                    }}

                select={handleCalenderSelect}

                nowIndicator={nowIndicator}
                selectOverlap={false}
                eventContent={renderEventContent}

                dateClick={handleCalenderClick}
                customButtons={{
                    duration: {
                        text: 'Dauer',
                    }
                }}
            />
        </div>
    );
};

export default WeekView;