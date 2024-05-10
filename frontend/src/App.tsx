import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Dashboard from './components/dashboard/Dashboard';
import CreatePoll from './components/polls/createPoll/CreatePoll';
import Availability from './components/availability/Availability';
//import Login from './components/login/Login';

const RedirectToDashboard: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/dashboard');
  }, [navigate]);

  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<RedirectToDashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/availability" element={<Availability />} />
        <Route path="/polls/create" element={<CreatePoll />} />
        <Route path="/" element={<RedirectToDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;