import { useKeycloak } from '@react-keycloak/web';
import { useEffect } from 'react';

const TokenManager = () => {
    const { keycloak } = useKeycloak();

    useEffect(() => {
        const refreshInterval = setInterval(() => {
            if (keycloak && keycloak.authenticated) {
                keycloak.updateToken(30).then((refreshed) => {
                    if (refreshed) {
                        console.log('Token was successfully refreshed');
                    } else {
                        console.log('Token is still valid');
                    }
                }).catch(() => {
                    console.error('Failed to refresh token');
                });
            }
        }, 60000); // Refresh token every minute

        return () => clearInterval(refreshInterval);
    }, [keycloak]);

    return null;
};

export default TokenManager;
