package com.stroodle.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/polls")
public class PollController {
    // HTTP-Methoden für Umfragen
    @Autowired
    private PollService pollService;

    @PostMapping
    public ResponseEntity<Poll> addPoll(@RequestBody Poll poll) {
        Poll savedPoll = pollService.createPoll(poll);
        return ResponseEntity.ok(savedPoll);
    }

    @GetMapping
    public ResponseEntity<List<Poll>> getAllPolls() {
        List<Poll> polls = pollService.getAllPolls();
        return ResponseEntity.ok(polls);
    }

    @GetMapping("/search/title")
    public ResponseEntity<List<Poll>> findByTitle(@RequestParam String title) {
        List<Poll> polls = pollService.getPollByTitle(title);
        return ResponseEntity.ok(polls);
    }

    @GetMapping("/search/description")
    public ResponseEntity<List<Poll>> findByDescription(@RequestParam String description) {
        List<Poll> polls = pollService.getPollByDescription(description);
        return ResponseEntity.ok(polls);
    }
}
