import React, { useState, useEffect } from 'react';
import HeaderComponent from '../common/header/Header';
import WeekView from '../shared/weekView/WeekView';
import { notEqual } from 'assert';
import UserService, { loggedInUserMock } from '../../services/UserService';
import { User, Availability, Weekday } from '../../models/User';


const AvailabilitySettings: React.FC = () => {
    const [userAvailability, setUserAvailability] = useState<Availability>({});

    useEffect(() => {
        (async () => {
            const currentUser = UserService.getLoggedInUser();
            const availability = await UserService.getAvailabilityOfUser(currentUser.id);
            setUserAvailability(availability);
        })();
    }, []);

    async function addUserAvailability(day: Weekday, start: string, end: string) {
        //console.log(day, start, end);
        console.log(userAvailability);

        if (!userAvailability[day]) {
            userAvailability[day] = [];
        }

        userAvailability[day]?.push({
            start,
            end
        });
        console.log(userAvailability);

        //await UserService.putAvailabilitByUser(userAvailability);
    };

    return (
        <div className='app'>
            <HeaderComponent />
            <div className='app-body'>
                <div className='content-tab'>
                    <div className='tab-item'>
                        <h1>Verfügbarkeit angeben
                            <button className="header-button" >Speichern</button>
                        </h1>
                        <WeekView useCase={'availability'} userAvailability={userAvailability} updateUserAvailability={addUserAvailability} />
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