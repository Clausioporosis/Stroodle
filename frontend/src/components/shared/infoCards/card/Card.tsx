import React, { useEffect, useState } from 'react';
import PollService from '../../../../services/PollService';
import { Poll } from '../../../../models/Poll';
import UserService from '../../../../services/UserService';
import { User } from '../../../../models/User';
import { ClockHistory, Hourglass, Pencil, Share, Trash3, Person, GeoAlt } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import Modal from '../../modal/Modal';

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
    const [isModalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState<string>('');
    const [modalContent, setModalContent] = useState<React.ReactNode>(null);
    const [confirmButtonText, setConfirmButtonText] = useState<string | undefined>(undefined);
    const [showCloseButton, setShowCloseButton] = useState<boolean>(true);
    const [cancelButtonText, setCancelButtonText] = useState<string | undefined>("Cancel");

    const { keycloak } = useKeycloak();
    const userService = new UserService(keycloak);
    const pollService = new PollService(keycloak);
    const navigate = useNavigate();

    useEffect(() => {
        setBookedDateInfo();
        getOrganizerInfo();
    }, []);

    function handleDeleteClick(event: React.MouseEvent) {
        event.stopPropagation();
        setModalTitle('Poll löschen');
        setModalContent(<p>Möchtest du den Poll wirklich löschen?</p>);
        setConfirmButtonText('Löschen');
        setCancelButtonText("Cancel");
        setShowCloseButton(true);
        setModalOpen(true);
    }

    function handleShareClick(event: React.MouseEvent) {
        event.stopPropagation();
        setModalTitle('Umfrage teilen');
        setModalContent(
            <div className='link-row'>
                <input id="shareLink" type="text" value={`${process.env.REACT_APP_BASE_URL}/polls/${poll.id}`} readOnly />
                <button onClick={handleCopyClick}>Kopieren</button>
            </div>
        );
        setConfirmButtonText(undefined);
        setCancelButtonText(undefined);
        setShowCloseButton(true);
        setModalOpen(true);
    }

    function handleEditClick(event: React.MouseEvent) {
        event.stopPropagation();
        navigate(`/polls/edit/${poll.id}`);
    }

    function handleCardClick() {
        navigate(`/polls/${poll.id}`);
    }

    function getOrganizerInfo() {
        userService.getUserById(keycloak.tokenParsed?.sub!)
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

    const handleConfirm = () => {
        if (modalTitle === 'Poll löschen') {
            pollService?.deletePollById(poll.id!)
                .then(() => {
                    console.log('Poll erfolgreich gelöscht!');
                    onPollDelete?.();
                })
                .catch((error) => {
                    console.error('Es gab einen Fehler beim Löschen des Polls!', error);
                });
        } else {
            console.log('Confirmed');
        }
        setModalOpen(false);
    };

    const handleCancel = () => {
        console.log('Cancelled');
        setModalOpen(false);
    };

    const handleCopyClick = () => {
        const textField = document.getElementById('shareLink') as HTMLInputElement;
        if (textField) {
            navigator.clipboard.writeText(textField.value)
                .then(() => {
                    alert('Link kopiert!');
                })
                .catch(err => {
                    console.error('Fehler beim Kopieren des Links: ', err);
                });
        }
    };

    return (
        <div className='card' onClick={handleCardClick}>
            <div className='info-section'>
                <div className={`info-text ${useCase === 'runningPolls' ? 'line-clamp-2' : ''}`}>
                    <h2>{poll.title}</h2>
                    <p className={`${useCase === 'runningPolls' ? 'line-clamp-2' : ''}`}>
                        {poll.description !== '' ? poll.description : '-'}
                    </p>
                </div>
                <div className='info-plus'>
                    {useCase === 'myPolls' ? (
                        <p><Hourglass className='icon' />-</p>
                    ) : useCase === 'runningPolls' ? (
                        <>
                            <p><GeoAlt className='icon' />{poll.location !== '' ? poll.location : '-'}</p>
                            <div className='flex'>
                                <p><Person className='icon' />
                                    {organizerInfo?.firstName} {organizerInfo?.lastName}
                                </p>
                                {poll.bookedDateIndex !== null ? (
                                    <p><ClockHistory className='icon' />{bookedDate?.duration}</p>
                                ) : (
                                    <p><Hourglass className='icon' />-</p>
                                )}
                            </div>
                        </>
                    ) : null}
                </div>
            </div>

            {useCase === 'myPolls' && (
                <div className='button-group'>
                    <button className='card-button' onClick={handleEditClick}>
                        <Pencil className='icon' />
                    </button>
                    <button className='card-button' onClick={handleShareClick}>
                        <Share className='icon' />
                    </button>
                    <button className='card-button' onClick={handleDeleteClick}>
                        <Trash3 className='icon' />
                    </button>
                </div>
            )}

            {(useCase === 'runningPolls' || useCase === 'myPolls' && poll.bookedDateIndex !== null) && (
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
                                {(bookedDate?.duration !== 'ganztägig') ? (
                                    <>
                                        <span className="first">{bookedDate?.time.substring(0, 1)}</span>
                                        <span className="rest">{bookedDate?.time.substring(1)} Uhr</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="first">{bookedDate?.duration.substring(0, 1)}</span>
                                        <span className="rest">{bookedDate?.duration.substring(1)}</span>
                                    </>
                                )}
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

            <Modal
                isOpen={isModalOpen}
                title={modalTitle}
                content={modalContent}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                confirmButtonText={confirmButtonText}
                cancelButtonText={cancelButtonText}
                showCloseButton={showCloseButton}
            />
        </div>
    );
};

export default Card;
