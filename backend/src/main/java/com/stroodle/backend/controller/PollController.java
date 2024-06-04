package com.stroodle.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import com.stroodle.backend.model.Poll;
import com.stroodle.backend.service.PollService;

import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/polls")
public class PollController {
    @Autowired
    private PollService pollService;

    @PostMapping
    public ResponseEntity<Poll> addPoll(@Valid @RequestBody Poll poll) {
        Poll savedPoll = pollService.createPoll(poll);
        return ResponseEntity.ok(savedPoll);
    }

    @GetMapping
    public ResponseEntity<List<Poll>> getAllPolls() {
        List<Poll> polls = pollService.getAllPolls();
        return ResponseEntity.ok(polls);
    }

    @GetMapping("/search/{id}")
    public ResponseEntity<Poll> getPollById(@PathVariable String id) {
        Optional<Poll> poll = pollService.getPollById(id);
        return poll.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/search/title")
    public ResponseEntity<List<Poll>> findByTitle(@RequestParam String title) {
        List<Poll> polls = pollService.getPollByTitle(title);
        return ResponseEntity.ok(polls);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Poll> updatePoll(@PathVariable String id, @RequestBody Poll poll) {
        poll.setId(id);
        Poll updatedPoll = pollService.updatePoll(poll);
        return ResponseEntity.ok(updatedPoll);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePoll(@PathVariable String id) {
        pollService.deletePoll(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<List<Poll>> getMyPolls() {
    JwtAuthenticationToken authentication = (JwtAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
    String userId = (String) authentication.getToken().getClaims().get("sub");

    List<Poll> polls = pollService.findPollsByOrganizerId(userId);
    return ResponseEntity.ok(polls);
    }

}
