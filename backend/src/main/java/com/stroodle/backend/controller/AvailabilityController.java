package com.stroodle.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.stroodle.backend.model.Availability;
import com.stroodle.backend.service.AvailabilityService;

@RestController
@RequestMapping("/users/{userId}/availability")
public class AvailabilityController {

    @Autowired
    private AvailabilityService availabilityService;

    @PostMapping
    public void setAvailability(@PathVariable String userId, @RequestBody Availability availability) {
        availabilityService.setAvailability(userId, availability);
    }

    @GetMapping
    public Availability getAvailability(@PathVariable String userId) {
        return availabilityService.getAvailability(userId);
    }
}