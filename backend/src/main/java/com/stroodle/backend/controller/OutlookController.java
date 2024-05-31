package com.stroodle.backend.controller;

import com.microsoft.aad.msal4j.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.concurrent.CompletableFuture;
import jakarta.servlet.http.HttpSession;

import java.net.URI;
import java.util.Collections;

@RestController
@RequestMapping("/api/outlook")
public class OutlookController {

    @Value("${azure.client-id}")
    private String clientId;

    @Value("${azure.client-secret}")
    private String clientSecret;

    @Value("${azure.authority}")
    private String authority;

    @Value("${azure.redirect-uri}")
    private String redirectUri;

    @GetMapping("/connect")
    public ResponseEntity<String> connectOutlook(@RequestParam String code, HttpSession session) {
        try {
            String codeVerifier = (String) session.getAttribute("codeVerifier");
            if (codeVerifier == null) {
                return ResponseEntity.status(400).body("Code verifier not found in session");
            }

            ConfidentialClientApplication app = ConfidentialClientApplication.builder(clientId,
                    ClientCredentialFactory.createFromSecret(clientSecret))
                    .authority(authority)
                    .build();

            AuthorizationCodeParameters parameters = AuthorizationCodeParameters.builder(
                    code,
                    new URI(redirectUri))
                    .scopes(Collections.singleton("https://graph.microsoft.com/.default"))
                    .codeVerifier(codeVerifier)
                    .build();

            CompletableFuture<IAuthenticationResult> future = app.acquireToken(parameters);
            IAuthenticationResult result = future.join();

            String accessToken = result.accessToken();
            return ResponseEntity.ok("Access Token: " + accessToken);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to connect Outlook account: " + e.getMessage());
        }
    }
}
