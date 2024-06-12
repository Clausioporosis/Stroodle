import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusSquare } from 'react-bootstrap-icons';
import keycloak from '../../keycloak';
import PollService from '../../services/PollService';
import { Poll } from '../../models/Poll';
import InfoCards from '../../components/shared/infoCards/InfoCards';

const Dashboard: React.FC = () => {
    const [myPolls, setMyPolls] = useState<Poll[]>([]);
    const [runningPolls, setRunningPolls] = useState<Poll[]>([]);

    const pollService = new PollService(keycloak);
    const navigate = useNavigate();

    useEffect(() => {
        getMyPolls();
        getInvitedPolls();
    }, []);

    async function getMyPolls() {
        const allPolls = await pollService.getMyPolls();
        setMyPolls(allPolls);
    }

    async function getInvitedPolls() {
        const allPolls = await pollService.getInvitedPolls();
        setRunningPolls(allPolls);
    }

    const handleCreateClick = () => {
        navigate('/polls');
    };

    return (
        <div className="app-body">
            <div className='tab my-poll-tab'>
                <h1 className="created-polls-tab-header">
                    Meine Umfragen
                    <div className='header-button-group'>
                        <div className="create-button" onClick={handleCreateClick}>
                            <PlusSquare className="plus-icon" />
                            <span className="text">Erstellen</span>
                        </div>
                    </div>
                </h1>
                {myPolls.length === 0 ? (
                    <p className="no-data-text">Keine Umfragen vorhanden</p>
                ) : (
                    <InfoCards useCase={'myPolls'} pollData={myPolls} onPollDelete={getMyPolls} />
                )}
            </div>

            <div className='tab event-tab'>
                <h1 className="created-polls-tab-header">
                    Events
                </h1>
                {runningPolls.length === 0 ? (
                    <p className="no-data-text">Keine anstehenden Events</p>
                ) : (
                    <InfoCards useCase={'runningPolls'} pollData={runningPolls} />
                )}
            </div>
        </div>
    );
};

export default Dashboard;
