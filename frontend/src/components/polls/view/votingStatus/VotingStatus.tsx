import React from 'react';
import DateCard from '../dateCard/DateCard';
import { ProposedDate } from '../../../../models/Poll';
import { Check2, X } from 'react-bootstrap-icons';

const VotingStatus: React.FC<{ proposedDates?: ProposedDate[], participantIds?: string[] }> = ({ proposedDates, participantIds }) => {
    return (
        <div className="grid">

            <div className="date-row">
                <div className="date-cell first-cell">Name</div>

                {proposedDates?.map((date, index) => (
                    <div className="date-cell">
                        <DateCard key={index} proposedDate={date} />
                    </div>
                ))}
            </div>

            {participantIds?.map(participantId => (

                <div key={participantId} className="voter-row">
                    <div className="voter-cell first-cell">{participantId}</div>

                    {proposedDates?.map((date, index) => (
                        <div key={index} className="voter-cell">
                            {date.votersId && date.votersId.includes(participantId) ? <Check2 className='icon' /> : <X className='icon' />}
                        </div>
                    ))}
                </div>
            ))}

        </div>

    );
};

export default VotingStatus;