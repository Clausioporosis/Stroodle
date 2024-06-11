package com.stroodle.backend.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.hamcrest.Matchers.hasSize;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stroodle.backend.config.SecurityConfig;
import com.stroodle.backend.exception.ResourceNotFoundException;
import com.stroodle.backend.model.Poll;
import com.stroodle.backend.service.PollService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@WebMvcTest(PollController.class)
@Import(SecurityConfig.class)
public class PollControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext context;

    @MockBean
    private PollService pollService;

    @InjectMocks
    private PollController pollController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();
    }

    @Test
    public void testAddPoll() throws Exception {
        // Erstelle einen Mock JWT Token
        Jwt jwt = Jwt.withTokenValue("token")
        .header("alg", "none")
        .claim("sub", "userId123")
        .build();
        JwtAuthenticationToken auth = new JwtAuthenticationToken(jwt, Arrays.asList(new SimpleGrantedAuthority("ROLE_USER")));

        SecurityContextHolder.getContext().setAuthentication(auth);

        // Erstelle ein Poll-Objekt, das hinzugefügt werden soll
        Poll newPoll = new Poll("2", "userId123", "New Poll", "New Description", "New Location", "2 hours", null, null, null);

        // Mocke das Verhalten des Services, um das neue Poll-Objekt zurückzugeben, wenn es gespeichert wird
        when(pollService.createPoll(any(Poll.class))).thenReturn(newPoll);

        // Konvertiere das Poll-Objekt in einen JSON-String
        ObjectMapper objectMapper = new ObjectMapper();
        String pollJson = objectMapper.writeValueAsString(newPoll);

        // Führe den POST-Request aus
        mockMvc.perform(post("/api/polls")
                .with(authentication(auth))
                .contentType("application/json")
                .content(pollJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(newPoll.getId()))
                .andExpect(jsonPath("$.title").value(newPoll.getTitle()))
                .andExpect(jsonPath("$.description").value(newPoll.getDescription()));              

    }

    @Test
    public void testGetAllPolls() throws Exception {
        // Erstelle einen Mock JWT Token
        Jwt jwt = Jwt.withTokenValue("token")
        .header("alg", "none")
        .claim("sub", "userId123")
        .build();
        JwtAuthenticationToken auth = new JwtAuthenticationToken(jwt, Arrays.asList(new SimpleGrantedAuthority("ROLE_USER")));

        SecurityContextHolder.getContext().setAuthentication(auth);

        // Erstelle eine Liste von Poll-Objekten, die als Antwort zurückgegeben werden soll
        List<Poll> expectedPolls = Arrays.asList(
            new Poll("1", "userId123", "Title1", "Desc1", "Location1", "Duration1", null, null, null),
            new Poll("2", "userId456", "Title2", "Desc2", "Location2", "Duration2", null, null, null)
    );
    when(pollService.getAllPolls()).thenReturn(expectedPolls);

    // Führe den GET-Request aus
    mockMvc.perform(get("/api/polls")
            .with(authentication(auth)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(2))) // Überprüft, ob die Liste zwei Elemente enthält
            .andExpect(jsonPath("$[0].id").value("1"))
            .andExpect(jsonPath("$[0].title").value("Title1"))
            .andExpect(jsonPath("$[1].id").value("2"))
            .andExpect(jsonPath("$[1].title").value("Title2"));
    }

    @Test
    public void testGetPollById() throws Exception {
        // Erstelle einen Mock JWT Token
        Jwt jwt = Jwt.withTokenValue("token")
            .header("alg", "none")
            .claim("sub", "userId123")
            .build();
        JwtAuthenticationToken auth = new JwtAuthenticationToken(jwt, Arrays.asList(new SimpleGrantedAuthority("ROLE_USER")));

        SecurityContextHolder.getContext().setAuthentication(auth);

        // Erstelle ein Poll-Objekt, das als Antwort zurückgegeben werden soll, wenn es gefunden wurde
        Poll foundPoll = new Poll("1", "userId123", "Title1", "Desc1", "Location1", "Duration1", null, null, null);
        when(pollService.getPollById("1")).thenReturn(Optional.of(foundPoll));

        // Führe den GET-Request aus
        mockMvc.perform(get("/api/polls/{id}", "1")
                .with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.title").value("Title1"))
                .andExpect(jsonPath("$.description").value("Desc1"));

        // Testen, was passiert, wenn keine Umfrage mit der ID gefunden wird
        when(pollService.getPollById("2")).thenReturn(Optional.empty());
        mockMvc.perform(get("/api/polls/{id}", "2")
                .with(authentication(auth)))
            .andExpect(status().isNotFound());
    }

    @Test
    public void testFindByTitle() throws Exception {
        // Erstelle einen Mock JWT Token
        Jwt jwt = Jwt.withTokenValue("token")
            .header("alg", "none")
            .claim("sub", "userId123")
            .build();
        JwtAuthenticationToken auth = new JwtAuthenticationToken(jwt, Arrays.asList(new SimpleGrantedAuthority("ROLE_USER")));

        SecurityContextHolder.getContext().setAuthentication(auth);

        // Erstelle eine Liste von Poll-Objekten, die als Antwort zurückgegeben werden soll, wenn ein Titel übereinstimmt
        List<Poll> expectedPolls = Arrays.asList(
            new Poll("1", "userId123", "Matching Title", "Description1", "Location1", "Duration1", null, null, null),
            new Poll("2", "userId123", "Matching Title", "Description2", "Location2", "Duration2", null, null, null)
        );
        when(pollService.getPollByTitle("Matching Title")).thenReturn(expectedPolls);

        // Führe den GET-Request aus
        mockMvc.perform(get("/api/polls/title")
                .with(authentication(auth))
                .param("title", "Matching Title"))  // Füge die Authentication und den Titelparameter hinzu
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value("1"))
            .andExpect(jsonPath("$[0].title").value("Matching Title"))
            .andExpect(jsonPath("$[1].id").value("2"))
            .andExpect(jsonPath("$[1].title").value("Matching Title"));

        // Testen, was passiert, wenn keine Umfragen mit dem gegebenen Titel gefunden werden
        when(pollService.getPollByTitle("Non-existing Title")).thenReturn(List.of());
        mockMvc.perform(get("/api/polls/title")
                .with(authentication(auth))
                .param("title", "Non-existing Title"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isEmpty());
        }

    @Test
    public void testUpdatePoll() throws Exception {
        // Erstelle einen Mock JWT Token
        Jwt jwt = Jwt.withTokenValue("token")
            .header("alg", "none")
            .claim("sub", "userId123")
            .build();
        JwtAuthenticationToken auth = new JwtAuthenticationToken(jwt, Arrays.asList(new SimpleGrantedAuthority("ROLE_USER")));

        SecurityContextHolder.getContext().setAuthentication(auth);

        // Erstelle ein Poll-Objekt, das aktualisiert werden soll
        Poll existingPoll = new Poll("1", "userId123", "Original Title", "Original Description", "Location1", "1 hour", null, null, null);
        Poll updatedPoll = new Poll("1", "userId123", "Updated Title", "Updated Description", "Location1", "2 hours", null, null, null);

        // Konvertiere das aktualisierte Poll-Objekt in einen JSON-String
        ObjectMapper objectMapper = new ObjectMapper();
        String updatedPollJson = objectMapper.writeValueAsString(updatedPoll);

        // Mocke das Verhalten des Services, um das aktualisierte Poll-Objekt zurückzugeben, wenn es gespeichert wird
        when(pollService.updatePoll(any(Poll.class))).thenReturn(updatedPoll);

        // Führe den PUT-Request aus
        mockMvc.perform(put("/api/polls/1")
                .with(authentication(auth))
                .contentType("application/json")
                .content(updatedPollJson))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value("1"))
            .andExpect(jsonPath("$.title").value("Updated Title"))
            .andExpect(jsonPath("$.description").value("Updated Description"));

        // Überprüfen, was passiert, wenn das zu aktualisierende Poll nicht existiert
        when(pollService.updatePoll(any(Poll.class))).thenThrow(new ResourceNotFoundException("Poll not found with id " + existingPoll.getId()));
        mockMvc.perform(put("/api/polls/1")
                .with(authentication(auth))
                .contentType("application/json")
                .content(updatedPollJson))
            .andExpect(status().isNotFound());
    }

    @Test
    public void testDeletePoll() throws Exception {
        // Erstelle einen Mock JWT Token
        Jwt jwt = Jwt.withTokenValue("token")
            .header("alg", "none")
            .claim("sub", "userId123")
            .build();
        JwtAuthenticationToken auth = new JwtAuthenticationToken(jwt, Arrays.asList(new SimpleGrantedAuthority("ROLE_USER")));

        SecurityContextHolder.getContext().setAuthentication(auth);

        // Vorbereitung: Keine Rückgabe, da das Poll gelöscht wird
        doNothing().when(pollService).deletePoll("1");

        // Führe den DELETE-Request aus
        mockMvc.perform(delete("/api/polls/1")
                .with(authentication(auth)))
            .andExpect(status().isNoContent());

        // Teste den Fall, wenn das Poll nicht existiert
        doThrow(new ResourceNotFoundException("Poll not found with id 1")).when(pollService).deletePoll("1");

        mockMvc.perform(delete("/api/polls/1")
                .with(authentication(auth)))
            .andExpect(status().isNotFound());
    }
    
    @Test
    public void testGetMyPolls() throws Exception {
        // Erstelle einen Mock JWT Token
        Jwt jwt = Jwt.withTokenValue("token")
                .header("alg", "none")
                .claim("sub", "userId123")
                .build();
        JwtAuthenticationToken auth = new JwtAuthenticationToken(jwt, Arrays.asList(new SimpleGrantedAuthority("ROLE_USER")));

        SecurityContextHolder.getContext().setAuthentication(auth);

        List<Poll> expectedPolls = Arrays.asList(new Poll("1", "userId123", "Title1", "Desc1", "Location1", "Duration1", null, null, null));
        when(pollService.findPollsByOrganizerId("userId123")).thenReturn(expectedPolls);

        // Führe den GET-Request aus
        mockMvc.perform(get("/api/polls/me")
                .with(authentication(auth)))
                .andExpect(status().isOk());
    }

    @Test
    public void testGetMyParticipations() throws Exception {
        // Erstelle einen Mock JWT Token
        Jwt jwt = Jwt.withTokenValue("token")
            .header("alg", "none")
            .claim("sub", "userId123")
            .build();
        JwtAuthenticationToken auth = new JwtAuthenticationToken(jwt, Arrays.asList(new SimpleGrantedAuthority("ROLE_USER")));

        SecurityContextHolder.getContext().setAuthentication(auth);

        // Erwartetes Ergebnis vorbereiten
        List<Poll> expectedPolls = Arrays.asList(
            new Poll("2", "userId456", "Title2", "Desc2", "Location2", "2 hours", Arrays.asList("userId123"), null, null),
            new Poll("3", "userId789", "Title3", "Desc3", "Location3", "3 hours", Arrays.asList("userId123"), null, null)
        );
        when(pollService.findPollsByParticipantId("userId123")).thenReturn(expectedPolls);

        // Führe den GET-Request aus
        mockMvc.perform(get("/api/polls/me/invitations")
                .with(authentication(auth)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(2))) // Prüfe, ob zwei Elemente zurückgegeben wurden
            .andExpect(jsonPath("$[0].id").value("2"))
            .andExpect(jsonPath("$[0].title").value("Title2"))
            .andExpect(jsonPath("$[1].id").value("3"))
            .andExpect(jsonPath("$[1].title").value("Title3"));
    }
}
