import React, { useEffect, useRef } from 'react';
import { ProposedDate } from '../../../../models/Poll';
import { People, Star, StarFill, Check2 } from 'react-bootstrap-icons';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

interface DateCardProps {
    proposedDate?: ProposedDate;
    isOrganizer: boolean;
    isActive?: boolean;
    isMostVotedDate?: boolean;
    matchesAvailability?: boolean;
    matchesIcsEvent?: boolean;
    icsEventTitle?: string;
    onDateClick: () => void;
}

const DateCard: React.FC<DateCardProps> = ({ proposedDate, isOrganizer, onDateClick, isActive = false, isMostVotedDate, matchesAvailability: isAvailable, matchesIcsEvent, icsEventTitle }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (matchesIcsEvent && cardRef.current) {
            tippy(cardRef.current, {
                content: `<div style="text-align: center;"><strong>Konflikt mit Kalenderereignis:</strong><br/>${icsEventTitle}</div>`,
                allowHTML: true,
                theme: 'conflicting-date',
            });
        } else if (isAvailable && cardRef.current) {
            tippy(cardRef.current, {
                content: 'Verfügbar',
                theme: 'available-date',
            });
        }
    }, [isAvailable, matchesIcsEvent, icsEventTitle]);

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
        const duration = isAllDay ? 'Ganztägig' : `${proposedDate.duration} Min.`;
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
        <div ref={cardRef} className={`date-card-component ${matchesIcsEvent ? 'conflicting-date' : (isAvailable && 'available-date')} ${isActive ? 'selected' : ''}`} onClick={onDateClick}>
            <div className='date-section'>
                <p className='weekday'>
                    <span className='first'>{weekday.substring(0, 2)}</span>
                    <span className='rest'>{weekday.substring(2)}</span>
                </p>
                <p className='day'>{day}</p>
                <p className='month'>{month}</p>
            </div>

            <div className='time-section'>
                {!isAllDay && (
                    <div className='time'>
                        <p className='start'>
                            <span className='first'>{startTime?.substring(0, 1)}</span>
                            <span className='rest'>{startTime?.substring(1)} Uhr</span>
                        </p>
                        <p className='end'>
                            <span>-&nbsp;</span>
                            <span className='first'>{endTime?.substring(0, 1)}</span>
                            <span className='rest'>{endTime?.substring(1)} Uhr</span>
                        </p>
                    </div>
                )}
                <p className='duration'>{duration}</p>
            </div>

            <div className='action-section'>
                {isOrganizer ? (
                    isActive ? (
                        <p className={'booked'}><StarFill className='icon star-fill' /></p>
                    ) : (
                        <p className={'booked'}><Star className='icon star' /></p>
                    )
                ) : (
                    <div className='check-box'>
                        {isActive && <Check2 className='icon' />}
                    </div>
                )}

                <p className={`voter-count ${isMostVotedDate && "most-voted"}`}><People className='icon' />{proposedDate?.voterIds.length}</p>
            </div >
        </div>
    );
};

export default DateCard;
