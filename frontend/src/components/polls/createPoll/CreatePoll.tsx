import React, { useState, useEffect } from 'react';
import './CreatePoll.css';
import Header from "../../common/header/Header"
import PollService from '../../../services/PollService';
import { Poll } from '../../../models/Poll';

const Dashboard: React.FC = () => {

    useEffect(() => {

    }, []);


    return (
        <div className="create-poll-container">
            <Header />
            <div className="create-poll-content-container">

            </div>
        </div>
    );
};

export default Dashboard;