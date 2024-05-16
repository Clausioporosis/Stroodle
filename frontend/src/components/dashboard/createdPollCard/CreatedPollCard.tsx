import React from 'react';
import { Alt, ClockHistory, Hourglass, Pencil, Share, Trash3 } from 'react-bootstrap-icons';

import PollService from '../../../services/PollService';
import { Poll } from '../../../models/Poll';

interface CreatedPollCardProps extends Poll {
    onEditClick: (id: string) => void;
    onShareClick: (id: string) => void;
    onDeleteClick: (id: string) => void;
}

const CreatedPollCard: React.FC<CreatedPollCardProps> = ({ id, title, description, onEditClick, onShareClick, onDeleteClick }) => {
    const handleEdit = () => {
        onEditClick(id!);
    };

    const handleShare = () => {
        onShareClick(id!);
    };

    const handleDelete = () => {
        if (window.confirm("Bist du sicher, dass du diese Umfrage löschen möchtest?")) {
            onDeleteClick(id!);
        }
    };

    return (
        <div className="poll-card-component">
            <div className="poll-card">
                <h2 className="poll-card-title">{title}</h2>
                <p className="poll-card-description">{description}</p>
                <div className="poll-card-bottom-left">
                    <p className="poll-card-expire">
                        <Hourglass className="hourglass-icon" />
                        Frist zum Abstimmen
                    </p>

                    <p className="poll-card-duration">
                        <ClockHistory className="clock-icon" />
                        Minuten
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
        </div >
    );
};

export default CreatedPollCard;