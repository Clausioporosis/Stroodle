import React from 'react';
import HeaderComponent from '../common/header/Header';
import WeekView from '../shared/weekView/WeekView';
import { notEqual } from 'assert';


const Availability: React.FC = () => {


    return (
        <div className='app'>
            <HeaderComponent />
            <div className='app-body'>
                <div className='content-tab'>
                    <div className='tab-item'>
                        <h1>Termine hinzufügen
                            <button className="header-button">Speichern</button>
                        </h1>
                        <WeekView useCase={'availability'} />
                    </div>
                </div>

                {/* <div className='content-tab'>
                    <div className='tab-item'>
                    </div>
                </div> */}

            </div>
        </div>
    );
};

export default Availability;