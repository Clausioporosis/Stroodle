import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import Header from "../common/header/Header"

import { PlusSquare } from 'react-bootstrap-icons';

import PollService from '../../services/PollService';
import { Poll } from '../../models/Poll';
import CreatedPollCard from './createdPollCard/CreatedPollCard';

const Dashboard: React.FC = () => {
    const [polls, setPolls] = useState<Poll[]>([]);

    useEffect(() => {
        setPolls(PollService.getAllPolls());
    }, []);

    const handleCreateClick = () => {
        alert(`Create poll`);
    };

    const handleEditClick = (pollId: string) => {
        alert(`Edit poll with id ${pollId}`);
    };

    const handleShareClick = (pollId: string) => {
        alert(`Share poll with id ${pollId}`);
    };

    const handleDeleteClick = (pollId: string) => {
        PollService.deletePollById(pollId);
        setPolls([...PollService.getAllPolls()]);
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
                                duration={poll.duration}
                                creatorId={poll.creatorId}
                                dates={poll.dates}
                                participants={poll.participants}
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