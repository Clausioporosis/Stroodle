import React from 'react';
import './CreatedPollCard.css';

import { Poll } from '../../../models/Poll';

const CreatedPollCard: React.FC<Poll> = ({ title, description, duration }) => {
    return (
        <div className="poll-card">
            <h2 className="poll-card-title">{title}</h2>
            <p className="poll-card-description">{description}</p>
            <div className="poll-card-bottom-left">
                <p className="poll-card-expire">expiring time</p>
                <p className="poll-card-duration">{duration} minutes</p>
            </div>
        </div>
    );
};

export default CreatedPollCard;