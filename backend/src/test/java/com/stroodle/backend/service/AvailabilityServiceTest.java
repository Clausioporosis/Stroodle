package com.stroodle.backend.service;

import com.stroodle.backend.model.Availability;
import com.stroodle.backend.repository.AvailabilityRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class AvailabilityServiceTest {

    @Mock
    private AvailabilityRepository availabilityRepository;

    @InjectMocks
    private AvailabilityService availabilityService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testSetAvailability() {
        Availability availability = new Availability();
        availability.setUserId("user1");

        availabilityService.setAvailability("user1", availability);

        verify(availabilityRepository, times(1)).save(availability);
        assertEquals("user1", availability.getUserId());
    }

    @Test
    public void testGetAvailability_UserExists() {
        String userId = "user1";
        Availability availability = new Availability();
        availability.setUserId(userId);

        when(availabilityRepository.findById(userId)).thenReturn(Optional.of(availability));

        Optional<Availability> result = availabilityService.getAvailability(userId);

        assertTrue(result.isPresent());
        assertEquals(userId, result.get().getUserId());
    }

    @Test
    public void testGetAvailability_UserDoesNotExist() {
        String userId = "user2";

        when(availabilityRepository.findById(userId)).thenReturn(Optional.empty());

        Optional<Availability> result = availabilityService.getAvailability(userId);

        assertFalse(result.isPresent());
    }
}
