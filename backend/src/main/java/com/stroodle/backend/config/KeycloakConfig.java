package com.stroodle.backend.config;

import jakarta.servlet.http.HttpServletRequest;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class KeycloakConfig {

    @Autowired
    private HttpServletRequest request;

    public Keycloak keycloak() {
        String token = request.getHeader("Authorization").substring(7);
        return KeycloakBuilder.builder()
                .serverUrl("https://login.stroodle.online")
                .realm("Stroodle")
                .clientId("stroodle-rest-api")
                .authorization(token)
                .build();
    }
}