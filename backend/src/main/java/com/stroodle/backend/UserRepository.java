package com.stroodle.backend;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
    // Hier können benutzerdefinierte Datenbankabfragen definiert werden
}
