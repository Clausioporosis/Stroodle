package com.stroodle.backend;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    // Hier können benutzerdefinierte Datenbankabfragen definiert werden
    List<User> findByEmail(String email);

    List<User> findByName(String name);
}
