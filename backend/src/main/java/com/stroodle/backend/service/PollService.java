package com.stroodle.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.stroodle.backend.exception.ResourceNotFoundException;
import com.stroodle.backend.model.Poll;
import com.stroodle.backend.repository.PollRepository;

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
        if (poll.getId() != null && pollRepository.existsById(poll.getId())) {
            throw new DataIntegrityViolationException("Poll with ID " + poll.getId() + " already exists.");
        }
        return pollRepository.save(poll);
    }

    public List<Poll> getAllPolls() {
        List<Poll> polls = pollRepository.findAll();
        if (polls.isEmpty()) {
            throw new ResourceNotFoundException("No polls found.");
        }
        return polls;
    }

    public Optional<Poll> getPollById(String id) {
        if (!pollRepository.existsById(id)) {
            throw new ResourceNotFoundException("Poll not found with id " + id);
        }
        return pollRepository.findById(id);
    }

    public List<Poll> getPollByTitle(String title) {
        List<Poll> polls = pollRepository.findByTitle(title);
        if (polls.isEmpty()) {
            throw new ResourceNotFoundException("No poll found with the title " + title);
        }
        return polls;
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
