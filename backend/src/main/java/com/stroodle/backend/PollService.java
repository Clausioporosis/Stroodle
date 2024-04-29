package com.stroodle.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

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

    public List<Poll> getPollByTitle(String title) {
        return pollRepository.findByTitle(title);
    }

    public List<Poll> getPollByDescription(String description) {
        return pollRepository.findByDescription(description);
    }

    // Methoden zur Verwaltung von Umfragen
}
