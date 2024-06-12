import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import PrivateRoute from './helpers/PrivateRoute';
import TokenManager from './helpers/TokenManager';
import Login from './pages/login/Login';
import { useKeycloak } from '@react-keycloak/web';

import Header from './components/common/header/Header';
import Dashboard from './pages/dashboard/Dashboard';
import Availability from './pages/availability/Availability';
import CreatePoll from './pages/poll/create/PollCreate';
import ViewPoll from './pages/poll/view/PollView';

import SpinningLoader from './components/shared/loading/SpinningLoader';


const App: React.FC = () => {
  const { keycloak, initialized } = useKeycloak();

  if (!initialized) {
    return <SpinningLoader />;
  }


  return (
    <BrowserRouter>
      <TokenManager />
      <div className='app'>
        {(keycloak.authenticated ?
          <Header /> : null)}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/availability" element={<PrivateRoute><Availability /></PrivateRoute>} />
          <Route path="/polls" element={<PrivateRoute><CreatePoll /></PrivateRoute>} />
          <Route path="/polls/edit/:pollId" element={<PrivateRoute><CreatePoll /></PrivateRoute>} />
          <Route path="/polls/:pollId" element={<PrivateRoute><ViewPoll /></PrivateRoute>} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;