import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import React, { useEffect, useState } from 'react';

interface WeekViewProps {
    useCase: string;
}

const WeekView: React.FC<WeekViewProps> = ({ useCase }) => {
    const [allDaySlot, setAllDaySlot] = useState<boolean>();
    const [nowIndicator, setNowIndicator] = useState<boolean>();
    const [selectable, setSelectable] = useState<boolean>();
    const [headerToolbar, setHeaderToolbar] = useState<any>();

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
        calenderSettings(useCase);
    }, []);

    const selectDate = (info: { startStr: string, endStr: string }) => {
        console.log('Start date: ' + info.startStr);
        console.log('End date: ' + info.endStr);
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
                weekday: 'short'
            }}

            eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            }}

            snapDuration="00:05:00"
            selectable={selectable}
            select={selectDate}
        />
    );
};

export default WeekView;