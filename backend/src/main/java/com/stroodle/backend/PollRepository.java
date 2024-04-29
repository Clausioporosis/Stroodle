package com.stroodle.backend;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import org.springframework.stereotype.Repository;

@Repository
public interface PollRepository extends MongoRepository<Poll, String> {
    // benutzerdefinierte Datenbankabfragen
    List<Poll> findByTitle(String title);

    List<Poll> findByDescription(String description);
}
