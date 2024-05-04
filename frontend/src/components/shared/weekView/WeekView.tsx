import React, { useState } from 'react';
import './WeekView.css';

interface WeekViewProps {
    width: string;
    visibleRows: number;
}

const WeekView: React.FC<WeekViewProps> = ({ width, visibleRows }) => {
    /* Weekday and hour arrays */
    const days = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
    const hours = Array.from({ length: 24 }, (_, i) => i);

    /* height for scroll container in additon with weekHeaderHeight, or visibleRows prop wont work as intended */
    const cellHeight = 30;
    const weekHeaderHeight = 26;
    const scrollContainerHeight = `${(visibleRows * cellHeight) + weekHeaderHeight}px`;

    /* useStates for the selection of multiple cells */
    const [selectionStartDay, setSelectionDay] = useState<string | null>(null);
    const [selectionStart, setSelectionStart] = useState<number | null>(null);
    const [selectionEnd, setSelectionEnd] = useState<number | null>(null);

    const formatMinutesIntoTime = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    };

    const handleMouseDown = (day: string, hour: number, quarter: number) => {
        const start = hour * 60 + quarter * 15;
        setSelectionDay(day);
        setSelectionStart(start);
    };

    const handleMouseUp = (day: string, hour: number, quarter: number) => {
        if (day !== selectionStartDay) {
            alert("Selection must end on the same day it started.");
            return;
        }

        const end = hour * 60 + quarter * 15;
        setSelectionEnd(end);

        if (selectionStart === end) {
            alert(`Clicked on ${day} at ${formatMinutesIntoTime(selectionStart as number)}`);
        } else {
            alert(`Selection from ${selectionStartDay} ${formatMinutesIntoTime(selectionStart as number)} to ${day} ${formatMinutesIntoTime(selectionEnd as number)}`);
        }
    };

    return (
        <div className="scroll-container" style={{ width, height: scrollContainerHeight }}>
            <table className="week-view-table">

                <thead>
                    <tr>
                        <th></th> {/* Extra cell for the hours */}
                        {days.map((day, index) => (
                            <th key={index}>{day}</th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {hours.map((hour) => (
                        <tr key={hour}>
                            <th>{hour < 10 ? `0${hour}:00` : `${hour}:00`}</th> {/* Display the hour */}
                            {days.map((day, index) => (
                                <td
                                    key={`${index}-${hour}`}>
                                    {Array(4).fill(0).map((_, quarter) => (
                                        <div
                                            className="quarterCell"
                                            key={quarter}
                                            onMouseDown={() => handleMouseDown(day, hour, quarter)}
                                            onMouseUp={() => handleMouseUp(day, hour, quarter)}
                                        />
                                    ))}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
    );
};

export default WeekView;