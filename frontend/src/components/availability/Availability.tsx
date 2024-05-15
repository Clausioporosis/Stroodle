import React, { useState, useEffect } from 'react';
import HeaderComponent from '../common/header/Header';
import WeekView from '../shared/weekView/WeekView';
import { notEqual } from 'assert';
import UserService, { loggedInUserMock } from '../../services/UserService';
import { User, Availability, Weekday, TimePeriod } from '../../models/User';


const AvailabilitySettings: React.FC = () => {
    const [reloadKey, setReloadKey] = useState(0);
    const [userAvailability, setUserAvailability] = useState<Availability>();
    const [pendingAvailabilityEntries, setPendingAvailabilityEntries] = useState<Availability>();

    useEffect(() => {
        getCurrentAvailability();
    }, []);

    function addAvailabilityEntry(day: Weekday, start: string, end: string) {
        setUserAvailability(prevAvailability => {
            const newAvailability = { ...prevAvailability };
            const newTimePeriod: TimePeriod = { start, end };
            // add time to existing day or create new day
            if (newAvailability[day]) {
                newAvailability[day]!.push(newTimePeriod);
            } else {
                newAvailability[day] = [newTimePeriod];
            }
            return newAvailability;
        });
    }

    // addidng new entry userAvailability
    function addPendingAvailabilityEntry(day: Weekday, start: string, end: string) {
        /*
        setPendingAvailabilityEntries(prevAvailability => {
            const newAvailability = { ...prevAvailability };
            const newTimePeriod: TimePeriod = { start, end };
            // add time to existing day or create new day
            if (newAvailability[day]) {
                newAvailability[day]!.push(newTimePeriod);
            } else {
                newAvailability[day] = [newTimePeriod];
            }
            return newAvailability;
        });
        */
    };

    function resetPendingAvailabilityEntries() {
        //setPendingAvailabilityEntries({});
        getCurrentAvailability();
    }

    async function getCurrentAvailability() {
        const currentUser = UserService.getLoggedInUser();
        const availability = await UserService.getAvailabilityOfUser(currentUser.id);
        setUserAvailability(availability);
        setPendingAvailabilityEntries(availability);
    }

    async function updateAvailability() {
        if (userAvailability) {
            setReloadKey(prevKey => prevKey + 1);
            await UserService.putAvailabilitByUser(userAvailability);
        }
    }

    function removeAvailability(usPending: Boolean, day: Weekday, start: string, end: string) {
        // had to filter userAvailability directly, because setAvailability is async 
        //userAvailability[day] = userAvailability[day]?.filter(slot => {
        //    return !(slot.start === start && slot.end === end);
        //});
        updateAvailability();
    }

    return (
        <div className='app'>
            <HeaderComponent />
            <div className='app-body'>
                <div className='content-tab'>
                    <h1>Verfügbarkeit angeben
                        <button className="header-button" onClick={resetPendingAvailabilityEntries} >X</button>
                        <button className="header-button" onClick={updateAvailability}>Speichern</button>
                    </h1>
                    <div className='tab-item'>
                        <WeekView key={reloadKey} useCase={'availability'} userAvailability={userAvailability} addAvailabilityEntry={addAvailabilityEntry} removeAvailability={removeAvailability} />
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