import React, { useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { useNavigate, useLocation } from 'react-router-dom';

const Login: React.FC = () => {
    const { keycloak } = useKeycloak();
    const navigate = useNavigate();
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const redirectPath = searchParams.get('redirect') || '/dashboard';

    useEffect(() => {
        if (keycloak.authenticated) {
            navigate(redirectPath, { replace: true });
        }
    }, [keycloak.authenticated, navigate, redirectPath]);

    const handleLogin = () => {
        keycloak.login();
    };

    return (
        <div>
            <h2>Bitte melden Sie sich an</h2>
            <button onClick={handleLogin}>Anmelden</button>
        </div>
    );
};

export default Login;
