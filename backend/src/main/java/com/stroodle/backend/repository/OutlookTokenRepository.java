package com.stroodle.backend.repository;

import com.stroodle.backend.model.OutlookToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OutlookTokenRepository extends JpaRepository<OutlookToken, Long> {
    Optional<OutlookToken> findByUserId(String userId);
}