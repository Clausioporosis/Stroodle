package com.stroodle.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.stroodle.backend.exception.ResourceNotFoundException;
import com.stroodle.backend.model.Availability;
import com.stroodle.backend.repository.AvailabilityRepository;

@Service
public class AvailabilityService {

    @Autowired
    private AvailabilityRepository availabilityRepository;

    public void setAvailability(String userId, Availability availability) {
        availability.setUserId(userId);
        availabilityRepository.save(availability);
    }

    public Availability getAvailability(String userId) {
        return availabilityRepository.findById(userId)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Availability for user with id " + userId + " not found"));
    }
}