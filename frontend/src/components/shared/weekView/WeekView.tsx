import React, { useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import { Availability, Weekday, TimePeriod } from '../../../models/User';
import { ProposedDate } from '../../../models/Poll';

interface WeekViewProps {
    useCase: string;

    reload?: boolean;
    userAvailability?: Availability;
    pendingAvailabilityEntries?: Availability;
    savePendingAvailabilityEntry?: (day: Weekday, start: string, end: string) => void;
    removeAvailability?: (isPending: Boolean, day: Weekday, start: string, end: string) => void;

    pollId?: string;
    duration?: string;
    proposedDates?: ProposedDate[];
    saveProposedDate?: (date: Date) => void;
    removeProposedDate?: (date: string, duration: string) => void;

    icsStatus?: { isStored: boolean, isValid: boolean };
    icsEvents?: any[];
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
    proposedDates,
    pollId,
    savePendingAvailabilityEntry,
    removeAvailability,
    removeProposedDate,
    saveProposedDate,
    icsStatus,
    icsEvents }) => {

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
            deleteProposedDate(event);
        }
        event.remove();
    }

    function renderEventContent(eventClickInfo: any) {
        // @ts-ignore
        const event = eventClickInfo.event; // unreasonable error: 'event' object does exist?!
        return (
            <>
                {((event.id !== 'expiredTimeHighlight') &&
                    <div className='events-content'>
                        {event.id === 'icsEvent' ? (
                            <p>{event.title}</p>
                        ) : !event.allDay ? (
                            <>
                                <p>
                                    {event.start.toLocaleTimeString().substring(0, 5)} - {event.end.toLocaleTimeString().substring(0, 5)}
                                </p>
                                <button className='event-button' onClick={() => handleEventDelete(event)}>
                                    <p>x</p>
                                </button>
                            </>
                        ) : (
                            <>
                                <p>
                                    Ganztägig
                                </p>
                                <button className='event-button' onClick={() => handleEventDelete(event)}>
                                    <p>x</p>
                                </button>
                            </>
                        )}
                    </div>
                )}
            </>
        );
    }


    // ics functions --------------------------------------------------------------------------------------------------

    useEffect(() => {
        if (!calendarApi) return;
        setTimeout(() => {
            removeIcsEvents();
            setIcsEventsToCalendar();
        }, 0);
    }, [calendarApi, icsEvents]);

    function removeIcsEvents() {
        calendarApi.getEvents().forEach((event: any) => {
            if (event.id === 'icsEvent') {
                event.remove();
            }
        });
    }

    function setIcsEventsToCalendar() {
        icsEvents?.map((event: any) => {
            const newIcsEvent: CalendarEvent = {
                id: 'icsEvent',
                title: event.title,
                start: new Date(event.start),
                end: new Date(event.end),
                allDay: event.allDay,
                display: 'background',
                color: '#c69555'
            };
            calendarApi.addEvent(newIcsEvent);
        });
    }

    // poll functions --------------------------------------------------------------------------------------------------

    const hasPoposedDates = useRef<boolean>(false);

    useEffect(() => {
        if (!calendarApi || pollId === undefined) return;
        setTimeout(() => {
            setProposedDatesToCalendar();
        }, 0);
    }, [calendarApi, proposedDates]);

    // add user availability to calendar once calendarApi is available and userAvailability is set
    function setProposedDatesToCalendar() {
        if (proposedDates && !hasPoposedDates.current && calendarApi) {
            proposedDates.map((proposedDate: ProposedDate) => {
                let start = new Date(proposedDate.date);
                let end = new Date(proposedDate.date);
                end.setMinutes(end.getMinutes() + Number(proposedDate.duration));
                const allDay = proposedDate.duration === 'allDay' ? true : false;

                const newProposedDate: CalendarEvent = {
                    id: uuidv4(),
                    start: start,
                    end: end,
                    allDay: allDay,
                    color: '#4C9EBC'
                };
                calendarApi.addEvent(newProposedDate);
                hasPoposedDates.current = true;
            });
        }
    }

    function addProposedDate(clickInfo: any) {
        let start = new Date(clickInfo.date);
        let end = new Date(clickInfo.date);
        const allDay = duration === 'allDay' ? true : false;

        if (allDay) {
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
        } else {
            end.setMinutes(end.getMinutes() + Number(duration));
        }

        if (!checkIfProposedDateIsAllowed(start, end, allDay)) return;

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
    function deleteProposedDate(event: any) {
        let startDate = new Date(event.start);
        let duration = '';

        if (startDate.getTimezoneOffset() === 0) {
            startDate.setMinutes(startDate.getMinutes() + startDate.getTimezoneOffset());
        }

        if (event.allDay) {
            duration = 'allDay';
        } else {
            const endDate = new Date(event.end);
            const durationInMilliseconds = endDate.getTime() - startDate.getTime();
            const durationInMinutes = durationInMilliseconds / (1000 * 60);
            duration = `${durationInMinutes}`;
        }

        let startDateString = startDate.toISOString().replace('Z', '+00:00');
        removeProposedDate?.(startDateString, duration);
    }

    // check if proposed date is allowed (not in the past or overlapping with other allDay events)
    function checkIfProposedDateIsAllowed(start: Date, end: Date, allDay: boolean): boolean {
        const allEvents = calendarApi.getEvents();
        const now = new Date();

        if (allDay) {
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            if (start < today) {
                return false;
            }
        } else {
            if (start < now) {
                return false;
            }
        }

        const sameDayAllDayEventExists = allEvents.some((event: any) => {
            const eventStart = new Date(event.start);
            const eventEnd = new Date(event.end);

            return event.allDay && event.id !== 'icsEvent' && allDay &&
                (eventStart.toDateString() === start.toDateString() ||
                    eventEnd.toDateString() === end.toDateString());
        });

        return !sameDayAllDayEventExists;
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

        // disabling interval for now, as it causes overdraws ics events
        //const intervalId = setInterval(addHighlightsSafely, 30000);
        //return () => clearInterval(intervalId);
    }, [calendarApi]);

    function addExpiredTimeHighlightToCalenderEvents() {
        calendarApi.getEventById('expiredTimeHighlight')?.remove();
        const expiredTimeHighlight = {
            id: 'expiredTimeHighlight',
            start: new Date(0),
            end: new Date(),
            display: 'background',
            color: '#303030'
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
            setAvailabilityToCalender();
        }, 0); // delays execution until after the current render cycle to avoid flushSync warnings
    }, [reload]);

    useEffect(() => {
        setAvailabilityToCalender();
    }, [calendarApi, userAvailability]);

    // add user availability to calendar once calendarApi is available and userAvailability is set
    function setAvailabilityToCalender() {
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
        <div className='week-view-component'>
            <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                eventContent={renderEventContent}
                initialView="timeGridWeek"
                snapDuration="00:05:00"
                nowIndicator={true}
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