package com.stroodle.backend.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.stroodle.backend.model.Ics;
import org.springframework.stereotype.Repository;

@Repository
public interface IcsRepository extends MongoRepository<Ics, String> {
    Optional<Ics> findByUserId(String userId);
}