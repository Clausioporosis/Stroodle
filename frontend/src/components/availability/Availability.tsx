import React, { useState, useEffect } from 'react';
import { Availability, Weekday, TimePeriod } from '../../models/User';

import HeaderComponent from '../common/header/Header';
import UserService from '../../services/UserService';
import WeekView from '../shared/weekView/WeekView';


const AvailabilitySettings: React.FC = () => {
    const [reload, setReload] = useState(false);
    const [userAvailability, setUserAvailability] = useState<Availability>();
    const [pendingAvailabilityEntries, setPendingAvailabilityEntries] = useState<Availability>();

    useEffect(() => {
        getCurrentAvailability();
    }, []);

    async function getCurrentAvailability() {
        const currentUser = UserService.getLoggedInUser();
        const availability = await UserService.getAvailabilityOfUser(currentUser.id);
        setUserAvailability(availability);
    }

    function savePendingAvailabilityEntry(day: Weekday, startTime: string, endTime: string) {
        setPendingAvailabilityEntries(prevAvailability => {
            const newPendingAvailability = { ...prevAvailability };
            const newTimePeriod: TimePeriod = { start: startTime, end: endTime };
            if (newPendingAvailability[day]) {
                newPendingAvailability[day]?.push(newTimePeriod);
            } else {
                newPendingAvailability[day] = [newTimePeriod];
            }
            return newPendingAvailability;
        });
    }

    async function updateAvailability(availability: Availability | undefined) {
        if (availability) {
            await UserService.putAvailabilitByUser(availability);
        }
    }

    function removeAvailability(isPending: Boolean, day: Weekday, start: string, end: string) {
        const targetAvailability = isPending ? pendingAvailabilityEntries : userAvailability;
        if (targetAvailability) {
            targetAvailability[day] = targetAvailability[day]?.filter(slot => {
                return !(slot.start === start && slot.end === end);
            });
        }
        !isPending && updateAvailability(targetAvailability);
    }

    async function mergePendingWithCurrentAvailabilities() {
        const result: Availability = { ...userAvailability };

        Object.entries(pendingAvailabilityEntries ?? {}).forEach(([day, timePeriods]) => {
            const weekday = day as Weekday;
            if (result[weekday]) {
                result[weekday] = result[weekday]!.concat(timePeriods);
            } else {
                result[weekday] = timePeriods;
            }
        });

        setPendingAvailabilityEntries({});
        setUserAvailability(result);
        updateAvailability(result);
    }

    function handleSave() {
        mergePendingWithCurrentAvailabilities();
        setReload(prevReload => !prevReload);
    }

    return (
        <div className='app'>
            <HeaderComponent />
            <div className='app-body'>
                <div className='content-tab'>
                    <h1>Verfügbarkeit angeben
                        <div className='header-button-group'>
                            <button className="header-button" onClick={handleSave}>Speichern</button>
                        </div>
                    </h1>
                    <div className='tab-item'>
                        <WeekView
                            useCase={'availability'}
                            reload={reload}
                            userAvailability={userAvailability}
                            pendingAvailabilityEntries={pendingAvailabilityEntries}
                            savePendingAvailabilityEntry={savePendingAvailabilityEntry}
                            removeAvailability={removeAvailability} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AvailabilitySettings;