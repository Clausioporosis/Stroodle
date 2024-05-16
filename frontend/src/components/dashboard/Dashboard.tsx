import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import Header from "../common/header/Header"

import { PlusSquare } from 'react-bootstrap-icons';

import UserService from '../../services/UserService';
import PollService from '../../services/PollService';
import { Poll } from '../../models/Poll';
import CreatedPollCard from './createdPollCard/CreatedPollCard';

const Dashboard: React.FC = () => {
    const [polls, setPolls] = useState<Poll[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            const allPolls = await PollService.getAllPolls();
            setPolls(allPolls);
        })();
    }, []);

    const handleCreateClick = () => {
        navigate('/polls/create');
    };

    const handleEditClick = (pollId: string) => {
        alert(`Edit poll with id ${pollId}`);
    };

    const handleShareClick = (pollId: string) => {
        alert(`Share poll with id ${pollId}`);
    };

    const handleDeleteClick = (pollId: string) => {
        (async () => {
            await PollService.deletePollById(pollId);
            const allPolls = await PollService.getAllPolls();
            setPolls(allPolls);
        })();
    };

    return (
        <div className="app">
            <Header />
            <div className="app-body">
                <div className="content-tab">
                    <div className="tab-item">
                        <h1 className="created-polls-tab-header">
                            Meine Umfragen
                            <div className='header-button-group'>
                                <PlusSquare className="plus-icon" onClick={handleCreateClick} />
                            </div>
                        </h1>
                        <div className="tab-item">

                        </div>
                    </div>
                </div>
                <div className="content-tab">
                    <div className="tab-item">

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;