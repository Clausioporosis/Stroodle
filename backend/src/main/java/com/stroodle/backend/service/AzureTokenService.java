package com.stroodle.backend.service;

import com.microsoft.aad.msal4j.*;
import com.stroodle.backend.model.AzureToken;
import com.stroodle.backend.repository.AzureTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.MalformedURLException;
import java.time.Instant;
import java.util.Collections;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.CompletableFuture;

@Service
public class AzureTokenService {

    @Autowired
    private AzureTokenRepository tokenRepository;

    @Value("${azure.client-id}")
    private String clientId;

    @Value("${azure.client-secret}")
    private String clientSecret;

    @Value("${azure.authority}")
    private String authority;

    @Value("${azure.redirect-uri}")
    private String redirectUri;

    public void saveToken(String userId, String accessToken, Instant expiresAt) {
        AzureToken token = new AzureToken(userId, accessToken, expiresAt);
        tokenRepository.save(token);
    }

    // seems like token dosen't get refreshed
    public String getAccessToken(String userId) throws Exception {
        Optional<AzureToken> tokenOpt = tokenRepository.findByUserId(userId);
        if (tokenOpt.isPresent()) {
            AzureToken token = tokenOpt.get();
            if (token.getExpiresAt().isBefore(Instant.now())) {
                IAuthenticationResult result = acquireTokenSilently(token);
                token.setAccessToken(result.accessToken());
                token.setExpiresAt(result.expiresOnDate().toInstant());
                saveToken(token.getUserId(), token.getAccessToken(), token.getExpiresAt());
                return result.accessToken();
            } else {
                return token.getAccessToken();
            }
        }
        throw new RuntimeException("No token found for user");
    }

    private IAuthenticationResult acquireTokenSilently(AzureToken token) throws MalformedURLException {
        ConfidentialClientApplication app = ConfidentialClientApplication.builder(clientId,
                ClientCredentialFactory.createFromSecret(clientSecret))
                .authority(authority)
                .build();

        Set<String> scopes = Collections.singleton("https://graph.microsoft.com/.default");

        SilentParameters silentParameters = SilentParameters.builder(scopes, null).build();
        CompletableFuture<IAuthenticationResult> future = app.acquireTokenSilently(silentParameters);
        return future.join();
    }
}
