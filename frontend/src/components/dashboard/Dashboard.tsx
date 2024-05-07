import React, { useState, useEffect } from 'react';
import './Dashboard.css';

import { useNavigate } from 'react-router-dom';
import Header from "../common/header/Header"

import { PlusSquare } from 'react-bootstrap-icons';

import UserService from '../../services/UserService';
import PollService from '../../services/PollService';
import { Poll } from '../../models/Poll';
import CreatedPollCard from './createdPollCard/CreatedPollCard';

const Dashboard: React.FC = () => {
    const [polls, setPolls] = useState<Poll[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            const allPolls = await PollService.getAllPolls();
            setPolls(allPolls);
        })();
    }, []);

    const handleCreateClick = () => {
        navigate('/polls/create');
    };

    const handleEditClick = (pollId: string) => {
        alert(`Edit poll with id ${pollId}`);
    };

    const handleShareClick = (pollId: string) => {
        alert(`Share poll with id ${pollId}`);
    };

    const handleDeleteClick = (pollId: string) => {
        (async () => {
            await PollService.deletePollById(pollId);
            const allPolls = await PollService.getAllPolls();
            setPolls(allPolls);
        })();
    };

    return (
        <div className="dashboard-container">
            <Header />
            <div className="dashboard-content-container">
                <div className="created-polls-tab">
                    <h1 className="created-polls-tab-header">
                        Meine Umfragen
                        <PlusSquare className="plus-icon" onClick={handleCreateClick} />
                    </h1>
                    <div className="created-polls-list">
                        {polls.map((poll, index) => (
                            <CreatedPollCard
                                key={index}
                                id={poll.id}
                                title={poll.title}
                                description={poll.description}
                                location={poll.location}
                                duration={poll.duration}
                                organizerId={poll.organizerId}
                                proposedDates={poll.proposedDates}
                                participantsIds={poll.participantsIds}
                                onEditClick={handleEditClick}
                                onShareClick={handleShareClick}
                                onDeleteClick={handleDeleteClick}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;