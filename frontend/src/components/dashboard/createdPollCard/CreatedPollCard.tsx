import React from 'react';
import { Alt, ClockHistory, Hourglass, Pencil, Share, Trash3 } from 'react-bootstrap-icons';
import './CreatedPollCard.css';

import PollService from '../../../services/PollService';
import { Poll } from '../../../models/Poll';

interface CreatedPollCardProps extends Poll {
    onEditClick: (id: string) => void;
    onShareClick: (id: string) => void;
    onDeleteClick: (id: string) => void;
}

const CreatedPollCard: React.FC<CreatedPollCardProps> = ({ id, title, description, duration, onEditClick, onShareClick, onDeleteClick }) => {
    const handleEdit = () => {
        onEditClick(id);
    };

    const handleShare = () => {
        onShareClick(id);
    };

    const handleDelete = () => {
        onDeleteClick(id);
    };

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
                <Pencil className="icon" onClick={handleEdit} />
                <hr />
                <Share className="icon" onClick={handleShare} />
                <hr />
                <Trash3 className="icon trash-icon" onClick={handleDelete} />
            </div>
        </div>
    );
};

export default CreatedPollCard;