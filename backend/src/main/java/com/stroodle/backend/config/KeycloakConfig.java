package com.stroodle.backend.config;

import jakarta.servlet.http.HttpServletRequest;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class KeycloakConfig {

    @Autowired
    private HttpServletRequest request;

    @Value("${keycloak.auth-server-url:}")
    private String authServerUrl;

    @Value("${keycloak.realm:}")
    private String realm;

    @Value("${keycloak.resource:}")
    private String resource;

    public Keycloak keycloak() {
        String token = request.getHeader("Authorization").substring(7);
        return KeycloakBuilder.builder()
                .serverUrl(authServerUrl)
                .realm(realm)
                .clientId(resource)
                .authorization(token)
                .build();
    }
}