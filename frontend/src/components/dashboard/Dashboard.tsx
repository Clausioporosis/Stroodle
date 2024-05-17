import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import Header from "../common/header/Header"

import { Info, PlusSquare } from 'react-bootstrap-icons';

import UserService from '../../services/UserService';
import PollService from '../../services/PollService';
import { Poll } from '../../models/Poll';
import InfoCards from '../shared/infoCards/InfoCards';

const Dashboard: React.FC = () => {
    const [myPolls, setMyPolls] = useState<Poll[]>([]);
    const [invitedPolls, setInvitedPolls] = useState<Poll[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        getMyPolls();
    }, []);

    async function getMyPolls() {
        // get all polls, till specific api requests are implemented
        const allPolls = await PollService.getAllPolls();
        setMyPolls(allPolls);
    }

    const handleCreateClick = () => {
        navigate('/polls/create');
    };

    return (
        <div className="app">
            <Header />
            <div className="app-body">
                <div className="content-tab">

                    <h1 className="created-polls-tab-header">
                        Meine Umfragen
                        <div className='header-button-group'>
                            <PlusSquare className="plus-icon" onClick={handleCreateClick} />
                        </div>
                    </h1>

                    < InfoCards pollData={myPolls} />


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