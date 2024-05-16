import React, { useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import { Availability, Weekday, TimePeriod } from '../../../models/User';

interface WeekViewProps {
    useCase: string;

    reload?: boolean;
    userAvailability?: Availability;
    pendingAvailabilityEntries?: Availability;
    savePendingAvailabilityEntry?: (day: Weekday, start: string, end: string) => void;
    removeAvailability?: (isPending: Boolean, day: Weekday, start: string, end: string) => void;

    duration?: string;
    saveProposedDate?: (date: Date) => void;
}

interface CalendarEvent {
    id?: string;
    display?: string;
    color?: string;
    title?: string;
    start?: Date;
    startTime?: string;
    end?: Date;
    endTime?: string;
    daysOfWeek?: number[];
    allDay?: boolean;
}

const WeekView: React.FC<WeekViewProps> = ({
    useCase,
    reload,
    duration,
    userAvailability,
    pendingAvailabilityEntries,
    savePendingAvailabilityEntry,
    removeAvailability,
    saveProposedDate }) => {

    const [calendarApi, setCalendarApi] = useState<any>(null);
    const calendarRef = React.useRef<FullCalendar>(null);

    useEffect(() => {
        setCalendarApi(calendarRef.current?.getApi());
    }, []);

    function handleCalenderClick(clicktInfo: any) {
        if (useCase !== 'poll') return;
        addProposedDate(clicktInfo);
    }

    function handleCalenderSelection(selectInfo: any) {
        if (useCase === 'availability') {
            addPendingAvailabilityEntry(selectInfo);
        } else if (useCase === 'poll') {

        }
        selectInfo.view.calendar.unselect();
    }

    function handleEventDelete(event: any) {
        if (useCase === 'availability') {
            removeAvailabilityEntry(event);
        } else if (useCase === 'poll') {

        }
        event.remove();
    }

    function renderEventContent(eventClickInfo: any) {
        // @ts-ignore
        const event = eventClickInfo.event; // unreasonable error: 'event' object does exist!
        return (
            <>
                {((event.id !== 'expiredTimeHighlight') &&
                    < button onClick={() => handleEventDelete(event)}>
                        X
                    </button >
                )}
            </>
        );
    }

    // poll functions --------------------------------------------------------------------------------------------------

    function addProposedDate(clickInfo: any) {
        let start = new Date(clickInfo.date);
        let end = new Date(clickInfo.date);
        end.setMinutes(end.getMinutes() + Number(duration));
        const allDay = duration === 'allDay' ? true : false;

        if (checkIfProposedDateIsAllowed(start, end, allDay)) return;

        const newProposedDate: CalendarEvent = {
            id: uuidv4(),
            start: start,
            end: end,
            allDay: allDay,
            color: '#4C9EBC'
        };

        calendarApi.addEvent(newProposedDate);
        saveProposedDate?.(start);
    }

    // check if proposed date is allowed (not in the past or overlapping with other allDay events)
    function checkIfProposedDateIsAllowed(start: Date, end: Date, allDay: boolean): boolean {
        const allEvents = calendarApi.getEvents();
        const conflict = allEvents.some((event: any) => {
            return start < new Date() || event.allDay && allDay && event.start.getDay() === start.getDay();
        });
        return conflict;
    }

    // refresh the expired time highlight every 30 seconds
    useEffect(() => {
        if (!calendarApi || useCase !== 'poll') return;

        const addHighlightsSafely = () => {
            setTimeout(() => {
                addExpiredTimeHighlightToCalenderEvents();
            }, 0); // delays execution until after the current render cycle to avoid flushSync warnings

        };
        addHighlightsSafely();

        const intervalId = setInterval(addHighlightsSafely, 30000);
        return () => clearInterval(intervalId);
    }, [calendarApi]);

    function addExpiredTimeHighlightToCalenderEvents() {
        calendarApi.getEventById('expiredTimeHighlight')?.remove();
        const expiredTimeHighlight = {
            id: 'expiredTimeHighlight',
            start: new Date(0),
            end: new Date(),
            display: 'background',
            color: '#ddd'
        };
        calendarApi.addEvent(expiredTimeHighlight);
    };

    // availability functions ------------------------------------------------------------------------------------------

    const hasAddedAvailability = useRef<boolean>(false);

    useEffect(() => {
        if (!calendarApi) return;
        setTimeout(() => {
            hasAddedAvailability.current = false;
            calendarApi.removeAllEvents();
            refreshAvailability();
        }, 0); // delays execution until after the current render cycle to avoid flushSync warnings
    }, [reload]);

    useEffect(() => {
        refreshAvailability();
    }, [calendarApi, userAvailability]);

    // add user availability to calendar once calendarApi is available and userAvailability is set
    function refreshAvailability() {
        if (userAvailability && !hasAddedAvailability.current && calendarApi) {
            addAvailabilityToCalendar(userAvailability, false);
            pendingAvailabilityEntries && addAvailabilityToCalendar(pendingAvailabilityEntries, true);
            hasAddedAvailability.current = true;
        }
    }

    function addAvailabilityToCalendar(availability: Availability, isPending: boolean) {
        const color = isPending ? 'green' : '#4C9EBC';
        for (const day in availability) {
            const weekdayIndex = Object.values(Weekday).indexOf(day as Weekday);

            const timePeriods = availability[day as Weekday];
            timePeriods?.forEach((time: TimePeriod) => {

                const currentAvailabilityEntry: CalendarEvent = {
                    id: uuidv4(),
                    display: 'background',
                    color: color,
                    startTime: time.start,
                    endTime: time.end,
                    daysOfWeek: [weekdayIndex],
                    allDay: false
                };
                calendarApi.addEvent(currentAvailabilityEntry);
            });
        }
    }

    function addPendingAvailabilityEntry(selectInfo: any) {
        const startTime = selectInfo.start.toTimeString().split(' ')[0];
        const endTime = selectInfo.end.toTimeString().split(' ')[0];
        const weekdayIndex = selectInfo.start.getDay();
        const weekday = Object.values(Weekday)[weekdayIndex];

        const newAvailabilityEntry: CalendarEvent = {
            id: uuidv4(),
            display: 'background',
            color: 'green',
            startTime: startTime,
            endTime: endTime,
            daysOfWeek: [weekdayIndex],
            allDay: false
        };

        calendarApi.addEvent(newAvailabilityEntry);
        savePendingAvailabilityEntry?.(weekday, startTime, endTime);
    }

    function removeAvailabilityEntry(event: any) {
        const isPending = event.backgroundColor === 'green';
        const weekdayIndex = event.start.getDay();
        const weekday = Object.values(Weekday)[weekdayIndex];
        const startTime = event.start.toTimeString().split(' ')[0];
        const endTime = event.end.toTimeString().split(' ')[0];

        removeAvailability?.(isPending, weekday, startTime, endTime);
    }

    // set calendar settings based on use case ----------------------------------------------------------------------------

    const [allDaySlot, setAllDaySlot] = useState<boolean>();
    const [selectable, setSelectable] = useState<boolean>();
    const [headerToolbar, setHeaderToolbar] = useState<any>();

    useEffect(() => {
        setCalendarSettings(useCase);
    }, []);

    function setCalendarSettings(useCase: string) {
        if (useCase === 'availability') {
            availabilityViewSettings();
        } else if (useCase === 'poll') {
            pollViewSettings();
        }
    };

    function availabilityViewSettings() {
        setAllDaySlot(false);
        setSelectable(true);
        setHeaderToolbar(false);
    }

    function pollViewSettings() {
        setAllDaySlot(true);
        setSelectable(false);
        setHeaderToolbar({
            left: 'prev,next,today',
            center: 'title',
            right: ''
        });
    }

    return (
        <div className='tab-item'>
            <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                eventContent={renderEventContent}
                initialView="timeGridWeek"
                snapDuration="00:15:00"
                height={'100%'}
                locale={'de'}
                firstDay={1}
                eventTimeFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                }}
                dayHeaderFormat={{
                    weekday: 'short'
                }}
                selectAllow={
                    // only allow selection of time slots with a duration of at least 30 minutes and on the same day
                    function (selectInfo) {
                        let startDay = selectInfo.start.getDay();
                        let endDay = selectInfo.end.getDay();
                        let duration = (selectInfo.end.getTime() - selectInfo.start.getTime()) / 1000 / 60;
                        return startDay === endDay && duration >= 30;
                    }}

                headerToolbar={headerToolbar}
                allDaySlot={allDaySlot}
                selectable={selectable}
                selectOverlap={false}

                select={handleCalenderSelection}
                dateClick={handleCalenderClick}
            />
        </div>
    );
};

export default WeekView;