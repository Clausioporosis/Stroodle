package com.stroodle.backend.config;

import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class KeycloakConfig {
    public Keycloak createKeycloak(String token) {
        return KeycloakBuilder.builder()
                .serverUrl("https://login.stroodle.online")
                .realm("Stroodle")
                .clientId("stroodle-rest-api")
                .authorization(token)
                .build();
    }
}