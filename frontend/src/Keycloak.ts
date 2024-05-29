import Keycloak from 'keycloak-js';

const keycloakConfig = {
    url: 'https://login.stroodle.online',
    realm: 'Stroodle',
    clientId: 'stroodle-rest-api',
};

// get api working through swagger first

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
