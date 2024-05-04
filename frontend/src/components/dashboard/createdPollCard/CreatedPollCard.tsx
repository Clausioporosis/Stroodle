import React from 'react';
import { Alt, ClockHistory, Hourglass, Pencil, Share, Trash3 } from 'react-bootstrap-icons';
import './CreatedPollCard.css';

import PollService from '../../../services/PollService';
import { Poll } from '../../../models/Poll';

const CreatedPollCard: React.FC<Poll> = ({ id, title, description, duration }) => {
    return (
        <div className="poll-card">
            <h2 className="poll-card-title">{title}</h2>
            <p className="poll-card-description">{description}</p>
            <div className="poll-card-bottom-left">
                <p className="poll-card-expire">
                    <Hourglass className="hourglass-icon" />
                    expiring time
                </p>
                <p className="poll-card-duration">
                    <ClockHistory className="clock-icon" />
                    {duration} minutes
                </p>
            </div>
            <div className="poll-card-actions">
                <Pencil className="icon" />
                <hr />
                <Share className="icon" />
                <hr />
                <Trash3 className="icon trash-icon" onClick={() => alert(id)} />
            </div>
        </div>
    );
};

export default CreatedPollCard;