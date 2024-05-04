import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import Header from "../common/header/Header"

import PollService from '../../services/PollService';
import { Poll } from '../../models/Poll';
import CreatedPollCard from './createdPollCard/CreatedPollCard';

const Dashboard: React.FC = () => {
    const [polls, setPolls] = useState<Poll[]>([]);

    useEffect(() => {
        setPolls(PollService.getAllPolls());
    }, []);

    return (
        <div className="dashboard-container">
            <Header />
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
                />
            ))}
        </div>
    );
};

export default Dashboard;