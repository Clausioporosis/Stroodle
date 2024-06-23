package com.stroodle.backend;

import com.stroodle.backend.config.SecurityConfig;

import com.stroodle.backend.model.UserDto;
import com.stroodle.backend.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.mockito.InjectMocks;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;

import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.context.WebApplicationContext;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.stroodle.backend.controller.UserController;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@WebMvcTest(UserController.class)
@Import(SecurityConfig.class)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext context;

    @MockBean
    private UserService userService;

    @InjectMocks
    private UserController userController;

    @BeforeEach
    void setUp() { 
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();
    }

    private JwtAuthenticationToken getMockJwtAuthenticationToken() {
        Jwt jwt = Jwt.withTokenValue("token")
                .header("alg", "none")
                .claim("sub", "userId123")
                .build();
        return new JwtAuthenticationToken(jwt, Arrays.asList(new SimpleGrantedAuthority("ROLE_USER"))); // einen Token erstellen zur Authentifizierung.
    }

    @Test
    public void testGetUsers() throws Exception { // Liste von Usern erstellen und HTTP-GET-Anfrage an /api/users senden
        JwtAuthenticationToken auth = getMockJwtAuthenticationToken();
        SecurityContextHolder.getContext().setAuthentication(auth);

        List<UserDto> userList = new ArrayList<>();
        UserDto user1 = new UserDto();
        user1.setId("1");
        user1.setUsername("johndoe");
        user1.setFirstName("John");
        user1.setLastName("Doe");
        user1.setEmail("john.doe@example.com");

        UserDto user2 = new UserDto();
        user2.setId("2");
        user2.setUsername("janedoe");
        user2.setFirstName("Jane");
        user2.setLastName("Doe");
        user2.setEmail("jane.doe@example.com");

        userList.add(user1);
        userList.add(user2);

        when(userService.getUsers()).thenReturn(userList);

        mockMvc.perform(get("/api/users")
                .with(SecurityMockMvcRequestPostProcessors.authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is("1")))
                .andExpect(jsonPath("$[0].username", is("johndoe")))
                .andExpect(jsonPath("$[0].firstName", is("John")))
                .andExpect(jsonPath("$[0].lastName", is("Doe")))
                .andExpect(jsonPath("$[0].email", is("john.doe@example.com")));
    }

    @Test
    public void testGetUserById() throws Exception { // wenn eine ID angegeben wird, wird ein einzelner Benutzer zurückgegeben
        JwtAuthenticationToken auth = getMockJwtAuthenticationToken();
        SecurityContextHolder.getContext().setAuthentication(auth);

        UserDto user1 = new UserDto();
        user1.setId("1");
        user1.setUsername("johndoe");
        user1.setFirstName("John");
        user1.setLastName("Doe");
        user1.setEmail("john.doe@example.com");

        when(userService.getUserById("1")).thenReturn(user1);

        mockMvc.perform(get("/api/users/1")
                .with(SecurityMockMvcRequestPostProcessors.authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.id", is("1")))
                .andExpect(jsonPath("$.username", is("johndoe")))
                .andExpect(jsonPath("$.firstName", is("John")))
                .andExpect(jsonPath("$.lastName", is("Doe")))
                .andExpect(jsonPath("$.email", is("john.doe@example.com")));
    }

    @Test
    public void testSearchUsers() throws Exception { // Suchanfrage an /api/users/search senden 
        JwtAuthenticationToken auth = getMockJwtAuthenticationToken();
        SecurityContextHolder.getContext().setAuthentication(auth);

        List<UserDto> userList = new ArrayList<>();
        UserDto user1 = new UserDto();
        user1.setId("1");
        user1.setUsername("johndoe");
        user1.setFirstName("John");
        user1.setLastName("Doe");
        user1.setEmail("john.doe@example.com");

        UserDto user2 = new UserDto();
        user2.setId("2");
        user2.setUsername("janedoe");
        user2.setFirstName("Jane");
        user2.setLastName("Doe");
        user2.setEmail("jane.doe@example.com");

        userList.add(user1);
        userList.add(user2);

        when(userService.searchUsers(anyString())).thenReturn(userList);

        mockMvc.perform(get("/api/users/search").param("query", "Doe")
                .with(SecurityMockMvcRequestPostProcessors.authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].username", is("johndoe")))
                .andExpect(jsonPath("$[0].firstName", is("John")))
                .andExpect(jsonPath("$[0].lastName", is("Doe")))
                .andExpect(jsonPath("$[0].email", is("john.doe@example.com")));
    }
}