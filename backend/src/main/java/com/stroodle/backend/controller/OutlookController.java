package com.stroodle.backend.controller;

import com.stroodle.backend.service.OutlookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/outlook")
public class OutlookController {

    @Autowired
    private OutlookService outlookService;

    @GetMapping("/events")
    public ResponseEntity<String> getCalendarEvents(HttpSession session) {
        try {
            String userId = (String) session.getAttribute("userId");
            if (userId == null) {
                return ResponseEntity.status(400).body("User ID not found in session");
            }

            String events = outlookService.getCalendarEvents(userId);
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to retrieve calendar events: " + e.getMessage());
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<String> getUserProfile(HttpSession session) {
        try {
            String userId = (String) session.getAttribute("userId");
            if (userId == null) {
                return ResponseEntity.status(400).body("User ID not found in session");
            }

            String profile = outlookService.getUserProfile(userId);
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to retrieve user profile: " + e.getMessage());
        }
    }
}
