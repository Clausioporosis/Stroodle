import React, { useState, useEffect } from 'react';
import Header from "../common/header/Header"
import { useNavigate } from 'react-router-dom';
import PollService from '../../services/PollService';
import { Poll, ProposedDate } from '../../models/Poll';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';


const Availability: React.FC = () => {


    return (
        <div className="availability-page">
            <Header />
            <div className="availability-body">

            </div>
        </div>
    );
};

export default Availability;