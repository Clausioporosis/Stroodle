import React from 'react';

import UserService from '../../../services/UserService';
import PollService from '../../../services/PollService';
import { Poll } from '../../../models/Poll';

import Card from './card/Card';

interface InfoCardsProps {
    useCase: string;
    pollData: Poll[];
    onPollDelete?: () => void;
}

const InfoCards: React.FC<InfoCardsProps> = ({ pollData, useCase, onPollDelete }) => {


    return (
        <div className={`info-cards-component ${useCase === 'myPolls' ? 'my-cards' : 'event-cards'}`}>
            {pollData.map((poll, index) => (
                <Card useCase={useCase} key={index} poll={poll} onPollDelete={onPollDelete} />
            ))}
        </div>
    );
};

export default InfoCards;