import React, { useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { useNavigate, useLocation } from 'react-router-dom';
import { ReactComponent as Background } from '../../components/assets/background.svg';


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
        <div className='login'>
            <Background className="login-svg" />
            <div className='login-body'>
                <img src={process.env.PUBLIC_URL + '/stroodle-logo-white.png'} alt='Logo' className='stroodle-logo' />
                <button className='header-button' onClick={handleLogin}>Anmelden</button>
            </div>
        </div>
    );
};

export default Login;
