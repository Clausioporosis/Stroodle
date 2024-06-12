package com.stroodle.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.stroodle.backend.model.Availability;
import com.stroodle.backend.service.AvailabilityService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class AvailabilityController {

    @Autowired
    private AvailabilityService availabilityService;

    @PostMapping("/{userId}/availability")
    public void setAvailability(@PathVariable String userId, @RequestBody Availability availability) {
        availabilityService.setAvailability(userId, availability);
    }

    @GetMapping("/{userId}/availability")
    public Optional<Availability> getAvailability(@PathVariable String userId) {
        return availabilityService.getAvailability(userId);
    }

    @PostMapping("/merge")
    public Availability mergeAvailabilities(@RequestBody List<String> userIds) {
        return availabilityService.mergeAvailabilities(userIds);
    }
}