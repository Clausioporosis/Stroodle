package com.stroodle.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import org.springframework.stereotype.Repository;

import com.stroodle.backend.model.Poll;

@Repository
public interface PollRepository extends MongoRepository<Poll, String> {
    List<Poll> findByTitle(String title);
}
