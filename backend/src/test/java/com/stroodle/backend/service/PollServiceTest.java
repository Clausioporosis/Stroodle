package com.stroodle.backend.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.dao.DataIntegrityViolationException;

import com.stroodle.backend.exception.ResourceNotFoundException;
import com.stroodle.backend.model.Poll;
import com.stroodle.backend.repository.PollRepository;

public class PollServiceTest {

    @Mock
    private PollRepository pollRepository;

    @InjectMocks
    private PollService pollService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCreatePollSuccess() {
        Poll poll = new Poll("1", "user1", "Sample Poll", "This is a sample", "Office", "1 hour", null, null, null);
        when(pollRepository.save(any(Poll.class))).thenReturn(poll);

        Poll created = pollService.createPoll(poll);

        verify(pollRepository).save(any(Poll.class));
        assertEquals("Sample Poll", created.getTitle());
    }

    @Test
    public void testCreatePollFailure() {
        Poll poll = new Poll("1", "user1", "Sample Poll", "This is a sample", "Office", "1 hour", null, null, null);
        when(pollRepository.existsById(any(String.class))).thenReturn(true);

        try {
            pollService.createPoll(poll);
        } catch (DataIntegrityViolationException e) {
            assertEquals("Poll with ID 1 already exists.", e.getMessage());
        }
    }

    @Test
    public void testGetAllPollsSuccess() {
        List<Poll> expectedPolls = Arrays.asList(
                new Poll("1", "user1", "Sample Poll", "This is a sample", "Office", "1 hour", null, null, null),
                new Poll("2", "user2", "Another Poll", "Description", "Home", "2 hours", null, null, null));
        when(pollRepository.findAll()).thenReturn(expectedPolls);

        List<Poll> result = pollService.getAllPolls();

        verify(pollRepository).findAll();
        assertEquals(2, result.size());
        assertEquals("Sample Poll", result.get(0).getTitle());
        assertEquals("Another Poll", result.get(1).getTitle());
    }

    @Test
    public void testGetPollByIdFound() {
        Poll expectedPoll = new Poll("1", "user1", "Sample Poll", "This is a sample", "Office", "1 hour", null, null,
                null);

        when(pollRepository.existsById("1")).thenReturn(true);

        when(pollRepository.findById("1")).thenReturn(Optional.of(expectedPoll));

        Optional<Poll> result = pollService.getPollById("1");

        assertTrue(result.isPresent());
        assertEquals(expectedPoll, result.get());
    }

    @Test
    public void testGetPollByIdNotFound() {
        when(pollRepository.findById("2")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            pollService.getPollById("2").orElseThrow(() -> new ResourceNotFoundException("Poll not found with id 2"));
        });
    }

    @Test
    public void testGetPollByTitleFound() {
        List<Poll> expectedPolls = Arrays.asList(
                new Poll("1", "user1", "Test Poll", "This is a test poll", "Online", "2 hours", null, null, null),
                new Poll("2", "user2", "Test Poll", "Another test poll", "Office", "1 hour", null, null, null));

        when(pollRepository.findByTitle("Test Poll")).thenReturn(expectedPolls);

        List<Poll> result = pollService.getPollByTitle("Test Poll");

        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertEquals(2, result.size());
        assertEquals(expectedPolls, result);
    }

    @Test
    public void testGetPollByTitleNotFound() {
        when(pollRepository.findByTitle("Unknown Title")).thenReturn(Collections.emptyList());

        assertThrows(ResourceNotFoundException.class, () -> {
            pollService.getPollByTitle("Unknown Title");
        });
    }

    @Test
    void testUpdatePollSuccess() {
        Poll existingPoll = new Poll("1", "userId", "Old Title", "Old Description", "Old Location", "1 hour", null,
                null, null);
        Poll updatedPoll = new Poll("1", "userId", "Updated Title", "Updated Description", "Updated Location",
                "2 hours", null, null, null);

        when(pollRepository.findById("1")).thenReturn(Optional.of(existingPoll));

        when(pollRepository.save(any(Poll.class))).thenReturn(updatedPoll);

        Poll result = pollService.updatePoll(updatedPoll);

        assertNotNull(result);
        assertEquals("Updated Title", result.getTitle());
        assertEquals("Updated Description", result.getDescription());
        assertEquals("Updated Location", result.getLocation());
        assertEquals("2 hours", result.getDuration());

        verify(pollRepository).findById("1");
        verify(pollRepository).save(updatedPoll);
    }

    @Test
    void testUpdatePollNotFound() {
        Poll updatedPoll = new Poll("1", "userId", "Updated Title", "Updated Description", "Updated Location",
                "2 hours", null, null, null);

        when(pollRepository.findById("1")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> pollService.updatePoll(updatedPoll));

        verify(pollRepository).findById("1");

        verify(pollRepository, never()).save(any(Poll.class));
    }

    @Test
    void testDeletePollSuccess() {
        String existingPollId = "1";

        when(pollRepository.existsById(existingPollId)).thenReturn(true);

        pollService.deletePoll(existingPollId);

        verify(pollRepository).deleteById(existingPollId);
    }

    @Test
    void testDeletePollNotFound() {
        String nonExistingPollId = "2";

        when(pollRepository.existsById(nonExistingPollId)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> pollService.deletePoll(nonExistingPollId));

        verify(pollRepository).existsById(nonExistingPollId);

        verify(pollRepository, never()).deleteById(nonExistingPollId);
    }

    @Test
    void testFindPollsByOrganizerIdFound() {
        String organizerId = "organizer123";

        List<Poll> expectedPolls = Arrays.asList(
                new Poll("1", organizerId, "Title1", "Description1", "Location1", "1 hour", null, null, null),
                new Poll("2", organizerId, "Title2", "Description2", "Location2", "2 hours", null, null, null));

        when(pollRepository.findByOrganizerId(organizerId)).thenReturn(expectedPolls);

        List<Poll> result = pollService.findPollsByOrganizerId(organizerId);

        assertNotNull(result);
        assertEquals(expectedPolls.size(), result.size());
        assertEquals(expectedPolls, result);

        verify(pollRepository).findByOrganizerId(organizerId);
    }

    @Test
    void testFindPollsByOrganizerIdNotFound() {
        String organizerId = "organizer456";

        when(pollRepository.findByOrganizerId(organizerId)).thenReturn(Collections.emptyList());

        List<Poll> result = pollService.findPollsByOrganizerId(organizerId);

        assertTrue(result.isEmpty());

        verify(pollRepository).findByOrganizerId(organizerId);
    }

    @Test
    void testFindPollsByParticipantIdFound() {
        String participantId = "participant123";

        List<Poll> expectedPolls = Arrays.asList(
                new Poll("1", "organizer1", "Title1", "Description1", "Location1", "1 hour",
                        Arrays.asList(participantId), null, null),
                new Poll("2", "organizer2", "Title2", "Description2", "Location2", "2 hours",
                        Arrays.asList(participantId), null, null));

        when(pollRepository.findByParticipantIdsContains(participantId)).thenReturn(expectedPolls);

        List<Poll> result = pollService.findPollsByParticipantId(participantId);

        assertNotNull(result);
        assertEquals(expectedPolls.size(), result.size());
        assertEquals(expectedPolls, result);

        verify(pollRepository).findByParticipantIdsContains(participantId);
    }

    @Test
    void testFindPollsByParticipantIdNotFound() {
        String participantId = "participant456";

        when(pollRepository.findByParticipantIdsContains(participantId)).thenReturn(Collections.emptyList());

        List<Poll> result = pollService.findPollsByParticipantId(participantId);

        assertTrue(result.isEmpty());

        verify(pollRepository).findByParticipantIdsContains(participantId);
    }
}
