package com.stroodle.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PollService {
    @Autowired
    private PollRepository pollRepository;

    public Poll savePoll(Poll poll) {
        return pollRepository.save(poll);
    }

    public Poll createPoll(Poll poll) {
        return pollRepository.save(poll);
    }

    public List<Poll> getAllPolls() {
        return pollRepository.findAll();
    }

    public Optional<Poll> getPollById(String id) {
        return pollRepository.findById(id);
    }

    public List<Poll> getPollByTitle(String title) {
        return pollRepository.findByTitle(title);
    }

    public List<Poll> getPollByDescription(String description) {
        return pollRepository.findByDescription(description);
    }

    public Poll updatePoll(Poll poll) {
        pollRepository.findById(poll.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Poll not found with id " + poll.getId()));
        return pollRepository.save(poll);
    }

    public void deletePoll(String id) {
        if (!pollRepository.existsById(id)) {
            throw new ResourceNotFoundException("Poll not found with id " + id);
        }
        pollRepository.deleteById(id);
    }

    // Methoden zur Verwaltung von Umfragen
}
