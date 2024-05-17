import React from 'react';

import UserService from '../../../services/UserService';
import PollService from '../../../services/PollService';
import { Poll } from '../../../models/Poll';

import Card from './card/Card';

interface InfoCardsProps {
    pollData: Poll[];
}

const InfoCards: React.FC<InfoCardsProps> = (props) => {


    return (
        <div className='info-cards-component'>
            {props.pollData.map((poll, index) => (
                <Card key={index} poll={poll} />
            ))}
        </div>
    );
};

export default InfoCards;