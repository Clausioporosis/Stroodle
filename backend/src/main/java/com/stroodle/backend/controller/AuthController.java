package com.stroodle.backend.controller;

import com.microsoft.aad.msal4j.*;
import com.stroodle.backend.service.AzureTokenService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpSession;

import java.net.URI;
import java.net.URISyntaxException;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.Collections;
import java.util.concurrent.CompletableFuture;

import com.stroodle.backend.util.PKCEUtil;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Value("${azure.client-id}")
    private String clientId;

    @Value("${azure.client-secret}")
    private String clientSecret;

    @Value("${azure.authority}")
    private String authority;

    @Value("${azure.redirect-uri}")
    private String redirectUri;

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final AzureTokenService tokenService;

    public AuthController(AzureTokenService tokenService) {
        this.tokenService = tokenService;
    }

    @GetMapping("/authenticate/azure")
    public String getAuthLink(HttpSession session) throws NoSuchAlgorithmException, URISyntaxException {
        String codeVerifier = PKCEUtil.generateCodeVerifier();
        String codeChallenge = PKCEUtil.generateCodeChallenge(codeVerifier);
        session.setAttribute("codeVerifier", codeVerifier);

        // Get the user ID
        JwtAuthenticationToken authentication = (JwtAuthenticationToken) SecurityContextHolder.getContext()
                .getAuthentication();
        String userId = (String) authentication.getToken().getClaims().get("sub");
        session.setAttribute("userId", userId);

        logger.info("Session ID: {}", session.getId());
        logger.info("Code verifier saved in session: {}", codeVerifier);

        URI uri = new URI(String.format(
                // "%s/oauth2/v2.0/authorize?client_id=%s&response_type=code&redirect_uri=%s&response_mode=query&scope=openid%%20profile%%20offline_access%%20https://graph.microsoft.com/.default&code_challenge=%s&code_challenge_method=S256",

                authority, clientId, redirectUri, codeChallenge));

        return uri.toString();
    }

    @GetMapping("/authenticate/azure/callback")
    public ResponseEntity<String> connectOutlook(@RequestParam String code, HttpSession session) {
        try {
            String codeVerifier = (String) session.getAttribute("codeVerifier");
            String userId = (String) session.getAttribute("userId");

            logger.info("Session ID: {}", session.getId());
            logger.info("callback - Code verifier: " + codeVerifier);
            logger.info("callback - User ID: " + userId);

            if (codeVerifier == null) {
                logger.error("callback - Code verifier not found in session");
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
            Instant expiresAt = result.expiresOnDate().toInstant();

            tokenService.saveToken(userId, accessToken, expiresAt);

            return ResponseEntity.ok("Access Token: " + accessToken);
        } catch (Exception e) {
            logger.error("Failed to connect Outlook account", e);
            return ResponseEntity.status(500).body("Failed to connect Outlook account: " + e.getMessage());
        }
    }
}
