package com.stroodle.backend;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface PollRepository extends MongoRepository<Poll, String> {
    // Zusätzliche Abfragen nach Bedarf
}
