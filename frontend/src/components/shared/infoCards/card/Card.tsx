import React, { useEffect, useState, useRef } from 'react';

import PollService from '../../../../services/PollService';
import { Poll } from '../../../../models/Poll';
import UserService from '../../../../services/UserService';
import { User } from '../../../../models/User';
import { ClockHistory, Hourglass, Pencil, Share, Trash3, Person, GeoAlt } from 'react-bootstrap-icons';
import { get } from 'http';
import { useNavigate } from 'react-router-dom';

interface CardProps {
    useCase: string;
    poll: Poll;
    onPollDelete?: () => void;
}

interface BookedDate {
    time: string;
    date: string;
    duration: string;
    weekday: string;
}

const Card: React.FC<CardProps> = ({ poll, useCase, onPollDelete }) => {
    const [bookedDate, setBookedDate] = useState<BookedDate>();
    const [organizerInfo, setOrganizerInfo] = useState<User>();
    const [buttonsClicked, setButtonsClicked] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        setBookedDateInfo();
        getOrganizerInfo();
    }, []);

    //add a general button handle function
    function handleDeleteClick(event: React.MouseEvent) {
        // Prevent the click event from bubbling up to the card
        event.stopPropagation();
        if (!window.confirm('Möchtest du den Poll wirklich löschen?')) return;
        PollService?.deletePollById(poll.id!)
            .then(() => {
                console.log('Poll erfolgreich gelöscht!');
                onPollDelete?.();
            })
            .catch((error) => {
                console.error('Es gab einen Fehler beim Löschen des Polls!', error);
            });
    }

    function handleCardClick() {
        navigate(`/polls/${poll.id}`);
    }

    function getOrganizerInfo() {
        UserService.getUserById(poll.organizerId)
            .then((organizer) => {
                setOrganizerInfo(organizer);
            });
    }

    function setBookedDateInfo() {
        if (poll.bookedDateIndex == null) return;
        const bookedDate = new Date(poll.proposedDates[poll.bookedDateIndex].date);
        const time = bookedDate.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
        const date = bookedDate.toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' });
        const duration = poll.proposedDates[poll.bookedDateIndex].duration === 'allDay' ? 'ganztägig' : poll.proposedDates[poll.bookedDateIndex].duration + ' Minuten';
        const weekdays = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
        const weekday = weekdays[bookedDate.getDay()];

        let bookedDateObj: BookedDate = {
            time: time,
            date: date,
            duration: duration,
            weekday: weekday
        };
        setBookedDate(bookedDateObj);
    }

    function areButtonsClicked() {
        !buttonsClicked ? setButtonsClicked(true) : setButtonsClicked(false);
    }

    useEffect(() => {
        console.log('Buttons clicked: ', buttonsClicked);
    }, [buttonsClicked]);

    return (
        <div className={`card ${buttonsClicked ? 'not-active' : ''}`} onClick={handleCardClick}>
            <div className='info-section'>
                <div className='info-text'>
                    <h2>{poll.title}</h2>
                    {useCase === 'myPolls' && (
                        <p>{poll.description !== '' ? poll.description : '-'}</p>
                    )}
                </div>
                <div className='info-plus'>
                    {useCase === 'myPolls' ? (
                        <p><Hourglass className='icon' />-</p>
                    ) : useCase === 'runningPolls' ? (
                        <>
                            {poll.bookedDateIndex !== null ? (
                                <p><ClockHistory className='icon' />{bookedDate?.duration}</p>
                            ) : (
                                <p><Hourglass className='icon' />-</p>
                            )}
                            <p><GeoAlt className='icon' />{poll.location !== '' ? poll.location : '-'}</p>
                            <p><Person className='icon' />{organizerInfo?.firstName} {organizerInfo?.lastName}</p>
                        </>
                    ) : null}
                </div>
            </div>

            {useCase === 'myPolls' && (
                <div className='button-group' onMouseDown={areButtonsClicked} onMouseUp={areButtonsClicked}>
                    <button className='button' onClick={(event) => { event.stopPropagation(); event.preventDefault(); }}>
                        <Pencil className='icon' />
                    </button>
                    <button className='button' onClick={(event) => { event.stopPropagation(); event.preventDefault(); }}>
                        <Share className='icon' />
                    </button>
                    <button className='button' onClick={(event) => { event.stopPropagation(); event.preventDefault(); handleDeleteClick(event); }}>
                        <Trash3 className='icon' />
                    </button>
                </div>
            )}

            {useCase === 'runningPolls' && (
                <div className='state-section'>
                    {poll.bookedDateIndex !== null ? (
                        <>
                            <div className='date'>
                                <span className="first">{bookedDate?.weekday.substring(0, 2)}</span>
                                <span className="rest">{bookedDate?.weekday.substring(2)}</span>
                                <br />
                                {bookedDate?.date}
                            </div>
                            <div className='time'>
                                <span className="first">{bookedDate?.time.substring(0, 1)}</span>
                                <span className="rest">{bookedDate?.time.substring(1)}  Uhr</span>
                            </div>
                        </>
                    ) : (
                        <div className='state'>
                            <span className="first">o</span>
                            <span className="rest">ffen...</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Card;