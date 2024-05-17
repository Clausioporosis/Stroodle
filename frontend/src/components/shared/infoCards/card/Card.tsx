import React from 'react';
import { Poll } from '../../../../models/Poll';
import { Alt, ClockHistory, Hourglass, Pencil, Share, Trash3 } from 'react-bootstrap-icons';

interface CardProps {
    poll: Poll;
}

const Card: React.FC<CardProps> = ({ poll }) => {
    return (
        <div className="card">
            <div className='card-info'>
                <h2>{poll.title}</h2>
                <p>{poll.description}</p>
            </div>

            <div className='card-button-group'>
                <button className='card-button'>
                    <Pencil className='icon' />
                </button>
                <button className='card-button'>
                    <Share className='icon' />
                </button>
                <button className='card-button'>
                    <Trash3 className='icon' />
                </button>
            </div>
        </div>
    );
};

export default Card;