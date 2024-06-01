import React, { useState, useEffect } from 'react';
import { Availability, Weekday, TimePeriod } from '../../models/User';

import HeaderComponent from '../../components/common/header/Header';
import WeekView from '../../components/shared/weekView/WeekView';
import { useNavigate } from "react-router-dom";

import { useKeycloak } from '@react-keycloak/web';
import UserService from '../../services/UserService';

import OutlookService from '../../services/OutlookService';

const AvailabilitySettings: React.FC = () => {
    const [reload, setReload] = useState(false);
    const navigate = useNavigate();
    const [userAvailability, setUserAvailability] = useState<Availability>();
    const [pendingAvailabilityEntries, setPendingAvailabilityEntries] = useState<Availability>();

    const { keycloak } = useKeycloak();
    const userService = new UserService(keycloak);


    const outlookService = new OutlookService(keycloak);
    const handleAuthClick = async () => {
        try {
            const outlookService = new OutlookService(keycloak);
            const authLink = await outlookService.getAuthLink();
            window.location.href = authLink;
        } catch (error) {
            console.error('Error getting auth link:', error);
        }
    };




    useEffect(() => {
        getCurrentAvailability();
    }, []);

    async function getCurrentAvailability() {
        const availability = await userService.getUserAvailability(keycloak.tokenParsed?.sub!);
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
            await userService.setUserAvailability(availability, keycloak.tokenParsed?.sub!);
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
        <div className='app-body'>
            <div className='tab single-tab'>
                <h1>Verfügbarkeit angeben
                    <div className='header-button-group'>
                        <button className="header-button" onClick={handleAuthClick}>Auth</button>
                        <button className="header-button" onClick={() => navigate(-1)}>Zurück</button>
                        <button className="header-button" onClick={handleSave}>Speichern</button>
                    </div>
                </h1>

                <WeekView
                    useCase={'availability'}
                    reload={reload}
                    userAvailability={userAvailability}
                    pendingAvailabilityEntries={pendingAvailabilityEntries}
                    savePendingAvailabilityEntry={savePendingAvailabilityEntry}
                    removeAvailability={removeAvailability} />

            </div>
        </div>
    );
};

export default AvailabilitySettings;