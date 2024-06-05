package com.stroodle.backend.controller;

import com.microsoft.aad.msal4j.*;
import com.stroodle.backend.service.AzureTokenService;
import com.stroodle.backend.util.PKCEUtil;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.net.URISyntaxException;
import java.security.NoSuchAlgorithmException;
import java.util.Collections;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthController {

    @Value("${azure.client-id}")
    private String clientId;

    @Value("${azure.client-secret}")
    private String clientSecret;

    @Value("${azure.authority}")
    private String authority;

    @Value("${azure.redirect-uri}")
    private String redirectUri;

    private final AzureTokenService tokenService;

    @GetMapping("/authenticate/azure")
    public String getAuthLink(HttpSession session) throws NoSuchAlgorithmException, URISyntaxException {
        String codeVerifier = PKCEUtil.generateCodeVerifier();
        session.setAttribute("codeVerifier", codeVerifier);

        JwtAuthenticationToken authentication = (JwtAuthenticationToken) SecurityContextHolder.getContext()
                .getAuthentication();
        String userId = (String) authentication.getToken().getClaims().get("sub");
        session.setAttribute("userId", userId);

        return new URI(String.format(
                "%s/oauth2/v2.0/authorize?client_id=%s&response_type=code&redirect_uri=%s&response_mode=query&scope=openid%%20profile%%20offline_access%%20https://graph.microsoft.com/.default&code_challenge=%s&code_challenge_method=S256",
                authority, clientId, redirectUri, PKCEUtil.generateCodeChallenge(codeVerifier))).toString();
    }

    @GetMapping("/authenticate/azure/callback")
    public ResponseEntity<String> connectOutlook(@RequestParam String code, HttpSession session) {
        try {
            String codeVerifier = getSessionAttribute(session, "codeVerifier");
            String userId = getSessionAttribute(session, "userId");

            // Creating instance using the client ID and client secret
            ConfidentialClientApplication app = ConfidentialClientApplication
                    .builder(clientId, ClientCredentialFactory.createFromSecret(clientSecret))
                    .authority(authority).build();

            // Building the parameters for the authorization code request
            AuthorizationCodeParameters parameters = AuthorizationCodeParameters.builder(code, new URI(redirectUri))
                    .scopes(Collections.singleton("https://graph.microsoft.com/.default"))
                    .codeVerifier(codeVerifier).build();

            // aquire token using the authorization code and parameters
            IAuthenticationResult result = app.acquireToken(parameters).join();

            tokenService.saveToken(userId, result.accessToken(), result.expiresOnDate().toInstant());

            return ResponseEntity.ok("Access Token: " + result.accessToken());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to connect Outlook account: " + e.getMessage());
        }
    }

    private String getSessionAttribute(HttpSession session, String attributeName) {
        String attribute = (String) session.getAttribute(attributeName);
        if (attribute == null) {
            throw new IllegalStateException(attributeName + " not found in session");
        }
        return attribute;
    }
}
