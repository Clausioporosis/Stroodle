package com.stroodle.backend.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpSession;
import java.net.URISyntaxException;
import java.security.NoSuchAlgorithmException;
import java.util.Collections;
import java.util.concurrent.CompletableFuture;

import com.microsoft.aad.msal4j.AuthorizationCodeParameters;
import com.microsoft.aad.msal4j.ClientCredentialFactory;
import com.microsoft.aad.msal4j.ConfidentialClientApplication;
import com.microsoft.aad.msal4j.IAuthenticationResult;
import com.stroodle.backend.util.PKCEUtil;
import java.net.URI;

@CrossOrigin(origins = "${app.origin}")
@RestController
@RequestMapping("/api")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(OutlookController.class);

    @Value("${azure.client-id}")
    private String clientId;

    @Value("${azure.client-secret}")
    private String clientSecret;

    @Value("${azure.authority}")
    private String authority;

    @Value("${azure.redirect-uri}")
    private String redirectUri;

    @GetMapping("/authenticate/azure")
    public String getAuthLink(HttpSession session) throws NoSuchAlgorithmException, URISyntaxException {
        String codeVerifier = PKCEUtil.generateCodeVerifier();
        String codeChallenge = PKCEUtil.generateCodeChallenge(codeVerifier);
        session.setAttribute("codeVerifier", codeVerifier);
        logger.info("Code verifier saved in session: {}", codeVerifier);

        URI uri = new URI(String.format(
                "%s/oauth2/v2.0/authorize?client_id=%s&response_type=code&redirect_uri=%s&response_mode=query&scope=openid%%20profile%%20offline_access%%20https://graph.microsoft.com/.default&code_challenge=%s&code_challenge_method=S256",
                authority, clientId, redirectUri, codeChallenge));

        return uri.toString();
    }

    @GetMapping("/authenticate/azure/callback")
    public ResponseEntity<String> connectOutlook(@RequestParam String code, HttpSession session) {
        try {
            String codeVerifier = (String) session.getAttribute("codeVerifier");
            logger.info("Code verifier retrieved from session: {}", codeVerifier);
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

            // MSAL (Microsoft Authentication Library) manages the token, read more about it
            IAuthenticationResult result = future.join();
            String accessToken = result.accessToken();

            return ResponseEntity.ok("Access Token: " + accessToken);
        } catch (Exception e) {
            logger.error("Failed to connect Outlook account", e);
            return ResponseEntity.status(500).body("Failed to connect Outlook account: " + e.getMessage());
        }
    }
}

// ToDo
// - Save the access token in the database
// - Implement logic to refresh the token if expired (Write yourself or maybe
// MSAL has a built-in method for this)
// - write service to save and retrieve the token
