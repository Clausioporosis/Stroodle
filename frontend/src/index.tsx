import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/main.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import keycloak from './keycloak';
import { ReactKeycloakProvider } from '@react-keycloak/web';

const eventLogger = (event: string, error: any) => {
  console.log('onKeycloakEvent', event, error);
};

const tokenLogger = (tokens: any) => {
  console.log('onKeycloakTokens', tokens);
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <ReactKeycloakProvider
    authClient={keycloak}
    onEvent={eventLogger}
    onTokens={tokenLogger}
    initOptions={{ onLoad: 'check-sso' }}
  >
    <App />
  </ReactKeycloakProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();