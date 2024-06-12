package com.stroodle.backend.service;

import com.stroodle.backend.config.KeycloakConfig;
import com.stroodle.backend.exception.ResourceNotFoundException;
import com.stroodle.backend.model.UserDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.UserRepresentation;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private KeycloakConfig keycloakConfig;

    @Mock
    private Keycloak keycloak;

    @Mock
    private RealmResource realmResource;

    @Mock
    private UsersResource usersResource;

    @Mock
    private UserResource userResource;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    public void setUp() {
        ReflectionTestUtils.setField(userService, "realm", "Stroodle");
        when(keycloakConfig.keycloak()).thenReturn(keycloak);// keycloak
        when(keycloak.realm("Stroodle")).thenReturn(realmResource);// realmResource
        when(realmResource.users()).thenReturn(usersResource); // usersResource defeniert das Verhalten von
                                                               // usersResource und Mock-Objekte
    }

    @Test
    public void testGetUsers() {
        // Arrange
        UserRepresentation userRepresentation = createUserRepresentation("1", "testuser", "Test", "User",
                "test@example.com");

        when(usersResource.list()).thenReturn(Arrays.asList(userRepresentation));

        // Act
        List<UserDto> users = userService.getUsers();
        // Assert
        assertNotNull(users);// Prüft, ob die Liste nicht null ist
        assertFalse(users.isEmpty()); // Prüft, ob die Liste nicht leer ist
        assertEquals(1, users.size()); // Prüft, ob die Liste genau ein Element enthält
        UserDto user = users.get(0);
        assertEquals("1", user.getId());
        assertEquals("testuser", user.getUsername());
        assertEquals("Test", user.getFirstName());
        assertEquals("User", user.getLastName());
        assertEquals("test@example.com", user.getEmail());// Überprüfung, ob die Erwartungen erfüllt sind
    }

    private UserRepresentation createUserRepresentation(String id, String username, String firstName, String lastName,
            String email) {
        UserRepresentation userRepresentation = new UserRepresentation();
        userRepresentation.setId(id);
        userRepresentation.setUsername(username);
        userRepresentation.setFirstName(firstName);
        userRepresentation.setLastName(lastName);
        userRepresentation.setEmail(email); // setzen der werte für die Eingenschaften
        return userRepresentation;
    }

    @Test
    public void testGetUserById() {
        // Arrange
        String userId = "1";
        UserRepresentation userRepresentation = new UserRepresentation();
        userRepresentation.setId(userId);
        userRepresentation.setUsername("testuser");
        userRepresentation.setFirstName("Test");
        userRepresentation.setLastName("User");
        userRepresentation.setEmail("test@example.com");

        when(usersResource.get(userId)).thenReturn(userResource);
        when(userResource.toRepresentation()).thenReturn(userRepresentation);

        // Act
        UserDto user = userService.getUserById(userId);

        // Assert
        assertNotNull(user);
        assertEquals(userId, user.getId());// Prüft, ob die ID des Benutzers korrekt ist
        assertEquals("testuser", user.getUsername());
        assertEquals("Test", user.getFirstName());
        assertEquals("User", user.getLastName());
        assertEquals("test@example.com", user.getEmail());
    }

    @Test
    public void testGetUserById_NotFound() {
        // Arrange
        String userId = "1";
        when(usersResource.get(userId)).thenReturn(userResource);
        when(userResource.toRepresentation()).thenReturn(null);

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> userService.getUserById(userId)); // Prüft, ob eine
                                                                                              // ResourceNotFoundException
                                                                                              // ausgelöst wird
    }

    @Test
    public void testSearchUsers() {
        // Arrange
        String query = "test";
        UserRepresentation userRepresentation = new UserRepresentation();
        userRepresentation.setId("1");
        userRepresentation.setUsername("testuser");
        userRepresentation.setFirstName("Test");
        userRepresentation.setLastName("User");
        userRepresentation.setEmail("test@example.com");

        when(usersResource.search(query, 0, Integer.MAX_VALUE)).thenReturn(Arrays.asList(userRepresentation));

        // Act
        List<UserDto> users = userService.searchUsers(query);

        // Assert
        assertNotNull(users);
        assertFalse(users.isEmpty());
        assertEquals(1, users.size());
        UserDto user = users.get(0);
        assertEquals("1", user.getId());
        assertEquals("testuser", user.getUsername());
        assertEquals("Test", user.getFirstName());
        assertEquals("User", user.getLastName());
        assertEquals("test@example.com", user.getEmail());
    }
}
