package com.stroodle.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import org.springframework.stereotype.Repository;

import com.stroodle.backend.model.User;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    // Hier können benutzerdefinierte Datenbankabfragen definiert werden
    List<User> findByEmail(String email);

    List<User> findByName(String name);
}
