package com.stroodle.backend.service;

import org.keycloak.admin.client.Keycloak;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.stroodle.backend.config.KeycloakConfig;
import com.stroodle.backend.exception.ResourceNotFoundException;
import com.stroodle.backend.model.UserDto;
import org.springframework.beans.factory.annotation.Value;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Value("${keycloak.realm}")
    private String realm;

    @Autowired
    private KeycloakConfig keycloakConfig;

    public List<UserDto> getUsers() {
        Keycloak keycloak = keycloakConfig.keycloak();
        List<UserRepresentation> users = keycloak.realm(realm).users().list();
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

    public UserDto getUserById(String userId) {
        Keycloak keycloak = keycloakConfig.keycloak();
        UserRepresentation user = keycloak.realm(realm).users().get(userId).toRepresentation();
        if (user == null) {
            throw new ResourceNotFoundException("User with id " + userId + " not found");
        }
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        return dto;
    }

    public List<UserDto> searchUsers(String query) {
        Keycloak keycloak = keycloakConfig.keycloak();
        List<UserRepresentation> users = keycloak.realm(realm).users().search(query, 0, Integer.MAX_VALUE);
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