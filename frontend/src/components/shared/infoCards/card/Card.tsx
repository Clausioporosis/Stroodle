import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import PollService from '../../../../services/PollService';
import UserService from '../../../../services/UserService';
import { Poll } from '../../../../models/Poll';
import { User } from '../../../../models/User';
import { ClockHistory, Hourglass, Pencil, Share, Trash3, Person, GeoAlt, Clipboard, ClipboardCheck } from 'react-bootstrap-icons';
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
    const [confirmButtonText, setConfirmButtonText] = useState<string | undefined>(undefined);
    const [showCloseButton, setShowCloseButton] = useState<boolean>(true);
    const [cancelButtonText, setCancelButtonText] = useState<string | undefined>("Cancel");
    const [isCopied, setIsCopied] = useState<boolean>(false);

    const { keycloak } = useKeycloak();
    const userService = new UserService(keycloak);
    const pollService = new PollService(keycloak);
    const navigate = useNavigate();

    useEffect(() => {
        setBookedDateInfo();
        getOrganizerInfo();
    }, []);

    const getOrganizerInfo = () => {
        userService.getUserById(keycloak.tokenParsed?.sub!)
            .then((organizer) => {
                setOrganizerInfo(organizer);
            });
    };

    const setBookedDateInfo = () => {
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
    };

    const handleCardClick = () => {
        navigate(`/polls/${poll.id}`);
    };

    const handleEditClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        navigate(`/polls/edit/${poll.id}`);
    };

    const handleShareClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        setModalTitle('Umfrage teilen');
        setIsCopied(false);
        setConfirmButtonText(undefined);
        setCancelButtonText(undefined);
        setShowCloseButton(true);
        setModalOpen(true);
    };

    const handleDeleteClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        setModalTitle('Umfrage löschen');
        setModalOpen(true);
        setConfirmButtonText('Löschen');
        setCancelButtonText("Abbrechen");
        setShowCloseButton(false);
    };

    const handleConfirm = () => {
        if (modalTitle === 'Umfrage löschen') {
            pollService?.deletePollById(poll.id!)
                .then(() => {
                    console.log('Umfrage erfolgreich gelöscht!');
                    onPollDelete?.();
                })
                .catch((error) => {
                    console.error('Es gab einen Fehler beim Löschen der Umfrage!', error);
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
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2000);
                })
                .catch(err => {
                    console.error('Fehler beim Kopieren des Links: ', err);
                });
        }
    };

    const renderModalContent = () => {
        if (modalTitle === 'Umfrage teilen') {
            return (
                <div className="input-wrapper">
                    <input id="shareLink" type="text" value={`${process.env.REACT_APP_BASE_URL}/polls/${poll.id}`} readOnly />
                    {isCopied ?
                        <ClipboardCheck className='icon green' onClick={handleCopyClick} /> :
                        <Clipboard className='icon' onClick={handleCopyClick} />}
                </div>
            );
        } else if (modalTitle === 'Umfrage löschen') {
            return <p>Möchtest du diese Umfrage wirklich löschen?</p>;
        }
        return null;
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
                    <button className='card-button delete-button' onClick={handleDeleteClick}>
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
                content={renderModalContent()}
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
