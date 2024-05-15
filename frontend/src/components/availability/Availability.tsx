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

    function addAvailabilityEntry(day: Weekday, startTime: string, endTime: string) {
        setPendingAvailabilityEntries(prevAvailability => {
            const newPendingAvailability = { ...prevAvailability };
            const newTimePeriod: TimePeriod = { start: startTime, end: endTime };
            // add time to existing day or create new day
            if (newPendingAvailability[day]) {
                newPendingAvailability[day]?.push(newTimePeriod);
            } else {
                newPendingAvailability[day] = [newTimePeriod];
            }
            return newPendingAvailability;
        });
    }

    async function getCurrentAvailability() {
        const currentUser = UserService.getLoggedInUser();
        const availability = await UserService.getAvailabilityOfUser(currentUser.id);
        setUserAvailability(availability);
    }

    async function updateRemovedAvailability() {
        if (userAvailability) {
            setReloadKey(prevKey => prevKey + 1);
            await UserService.putAvailabilitByUser(userAvailability);
        }
    }

    async function mergeAvailability() {
        const result: Availability = { ...userAvailability };

        Object.entries(pendingAvailabilityEntries || {}).forEach(([day, timePeriods]) => {
            const weekday = day as Weekday;
            if (result[weekday]) {
                result[weekday] = result[weekday]!.concat(timePeriods);
            } else {
                result[weekday] = timePeriods;
            }
        });

        console.log('merged Availability', result);
        setPendingAvailabilityEntries({});
        setReloadKey(prevKey => prevKey + 1);
        setUserAvailability(result);
        await UserService.putAvailabilitByUser(result);
    }

    function removeAvailability(isPending: Boolean, day: Weekday, start: string, end: string) {
        const targetAvailability = isPending ? pendingAvailabilityEntries : userAvailability;
        if (targetAvailability) {
            targetAvailability[day] = targetAvailability[day]?.filter(slot => {
                return !(slot.start === start && slot.end === end);
            });
        }
        !isPending && updateRemovedAvailability();

        console.log('   user Availability', userAvailability);
        console.log('pending Availability', pendingAvailabilityEntries);
    }

    return (
        <div className='app'>
            <HeaderComponent />
            <div className='app-body'>
                <div className='content-tab'>
                    <h1>Verfügbarkeit angeben
                        <button className="header-button" onClick={mergeAvailability}>Speichern</button>
                    </h1>
                    <div className='tab-item'>
                        <WeekView key={reloadKey} useCase={'availability'} userAvailability={userAvailability} pendingAvailabilityEntries={pendingAvailabilityEntries} addAvailabilityEntry={addAvailabilityEntry} removeAvailability={removeAvailability} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AvailabilitySettings;