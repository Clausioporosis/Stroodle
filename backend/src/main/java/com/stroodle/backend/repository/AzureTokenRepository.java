package com.stroodle.backend.repository;

import com.stroodle.backend.model.AzureToken;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface AzureTokenRepository extends MongoRepository<AzureToken, String> {
    Optional<AzureToken> findByUserId(String userId);
}