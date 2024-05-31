package com.stroodle.backend.service;

import com.stroodle.backend.model.OutlookToken;
import com.stroodle.backend.repository.OutlookTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;

@Service
public class OutlookTokenService {
    @Autowired
    private OutlookTokenRepository tokenRepository;

    public void saveToken(String userId, String accessToken, String refreshToken, Instant expiresAt) {
        OutlookToken token = new OutlookToken();
        token.setUserId(userId);
        token.setAccessToken(accessToken);
        token.setRefreshToken(refreshToken);
        token.setExpiresAt(expiresAt);
        tokenRepository.save(token);
    }

    public Optional<String> getAccessToken(String userId) {
        Optional<OutlookToken> tokenOptional = tokenRepository.findByUserId(userId);
        if (tokenOptional.isPresent() && tokenOptional.get().getExpiresAt().isAfter(Instant.now())) {
            return Optional.of(tokenOptional.get().getAccessToken());
        }
        // Implement logic to refresh the token if expired
        return Optional.empty();
    }
}
