import React, { useState, useEffect } from 'react';
import HeaderComponent from '../common/header/Header';
import WeekView from '../shared/weekView/WeekView';
import { notEqual } from 'assert';
import UserService, { loggedInUserMock } from '../../services/UserService';
import { User, Availability } from '../../models/User';


const AvailabilitySettings: React.FC = () => {
    const [userAvailability, setUserAvailability] = useState<Availability>();

    useEffect(() => {
        (async () => {
            const currentUser = UserService.getLoggedInUser();
            const availability = await UserService.getAvailabilityOfUser(currentUser.id);
            setUserAvailability(availability);
        })();
    }, []);

    return (
        <div className='app'>
            <HeaderComponent />
            <div className='app-body'>
                <div className='content-tab'>
                    <div className='tab-item'>
                        <h1>Verfügbarkeit angeben
                            <button className="header-button" >Speichern</button>
                        </h1>
                        <WeekView useCase={'availability'} availability={userAvailability} />
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

export default AvailabilitySettings;