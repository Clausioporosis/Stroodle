package com.stroodle.backend;

import com.stroodle.backend.config.KeycloakConfig;
import com.stroodle.backend.exception.ResourceNotFoundException;
import com.stroodle.backend.model.UserDto;
import com.stroodle.backend.service.UserService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.representations.idm.UserRepresentation;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.admin.client.resource.RealmResource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;


public class UserServiceTest {

    @Mock
    private KeycloakConfig keycloakConfig;

    @Mock
    private Keycloak keycloak;

    @Mock
    private RealmResource realmResource;

    @Mock
    private UsersResource usersResource;

    @InjectMocks
    private UserService userService;

    private String realm = "test-realm";

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        when(keycloakConfig.keycloak()).thenReturn(keycloak);
        when(keycloak.realm(anyString())).thenReturn(realmResource);
        when(realmResource.users()).thenReturn(usersResource);
    }

    @Test
    void testGetUsers() {
        UserRepresentation user1 = new UserRepresentation();
        user1.setId("1");
        user1.setUsername("user1");
        user1.setFirstName("User");
        user1.setLastName("One");
        user1.setEmail("user1@example.com");

        UserRepresentation user2 = new UserRepresentation();
        user2.setId("2");
        user2.setUsername("user2");
        user2.setFirstName("User");
        user2.setLastName("Two");
        user2.setEmail("user2@example.com");

        when(usersResource.list()).thenReturn(Arrays.asList(user1, user2));

        List<UserDto> users = userService.getUsers();

        assertEquals(2, users.size());
        assertEquals("user1", users.get(0).getUsername());
        assertEquals("user2", users.get(1).getUsername());
    }

}
