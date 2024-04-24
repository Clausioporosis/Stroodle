import React from 'react';
import './WeekView.css';

interface WeekViewProps {
    width: string;
    visibleRows: number;
}

function handleCellClick(day: string, hour: number, quarter: number) {
    alert(`You clicked on ${day} at ${hour < 10 ? `0${hour}` : `${hour}`}:${quarter * 15 < 10 ? `0${quarter * 15}` : `${quarter * 15}`}`);
}

const WeekView: React.FC<WeekViewProps> = ({ width, visibleRows }) => {
    const days = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
    const hours = Array.from({ length: 24 }, (_, i) => i);

    const cellHeight = 30; // The height of each cell in pixels
    const WeekHeaderHeight = 26;
    const containerHeight = `${(visibleRows * cellHeight) + WeekHeaderHeight}px`;

    return (
        <div className="scroll-container" style={{ width, height: containerHeight }}>
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
                                <td key={`${index}-${hour}`}>
                                    {Array(4).fill(0).map((_, quarter) => (
                                        <div
                                            key={`${index}-${hour}-${quarter}`}
                                            onClick={() => handleCellClick(day, hour, quarter)}
                                            className="quarterCell"
                                        ></div>
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