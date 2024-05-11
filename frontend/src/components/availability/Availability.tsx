import React from 'react';
import HeaderComponent from '../common/header/Header';
import WeekView from '../shared/weekView/WeekView';


const Availability: React.FC = () => {


    return (
        <div className='app'>
            <HeaderComponent />
            <div className='app-body'>
                <div className='content-tab'>
                    <div className='tab-item'>
                        <h3>Verfügbarkeit</h3>
                        <WeekView useCase={'availability'} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Availability;