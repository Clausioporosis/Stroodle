package com.stroodle.backend.service;

import org.keycloak.admin.client.Keycloak;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.stroodle.backend.config.KeycloakConfig;
import com.stroodle.backend.model.UserDto;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private KeycloakConfig keycloakConfig;

    public List<UserDto> getUsers() {
        Keycloak keycloak = keycloakConfig.keycloak();
        List<UserRepresentation> users = keycloak.realm("Stroodle").users().list();
        return users.stream()
                .map(user -> {
                    UserDto dto = new UserDto();
                    dto.setId(user.getId());
                    dto.setUsername(user.getUsername());
                    dto.setFirstName(user.getFirstName());
                    dto.setLastName(user.getLastName());
                    dto.setEmail(user.getEmail());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}