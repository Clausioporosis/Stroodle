package com.stroodle.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.stroodle.backend.model.Availability;

public interface AvailabilityRepository extends MongoRepository<Availability, String> {
}
