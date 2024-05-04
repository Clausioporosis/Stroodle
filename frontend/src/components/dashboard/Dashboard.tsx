import React from 'react';
import './Dashboard.css';
import Header from "../common/header/Header"
import WeekView from "../shared/weekView/WeekView"

const Dashboard: React.FC = () => {
    return (
        <div className="dashboard-container">
            <Header />
            <WeekView width='600px' visibleRows={6} />
        </div>
    );
};

export default Dashboard;