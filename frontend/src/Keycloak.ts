import Keycloak from 'keycloak-js';

const keycloakConfig = {
    url: 'https://login.stroodle.online',
    realm: 'Stroodle',
    clientId: 'stroodle-rest-api',
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
