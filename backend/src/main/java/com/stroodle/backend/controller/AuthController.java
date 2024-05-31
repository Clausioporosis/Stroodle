package com.stroodle.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpSession;
import java.net.URISyntaxException;

import java.security.NoSuchAlgorithmException;

import com.stroodle.backend.util.PKCEUtil;
import java.net.URI;

@RestController
public class AuthController {

    @Value("${azure.client-id}")
    private String clientId;

    @Value("${azure.authority}")
    private String authority;

    @Value("${azure.redirect-uri}")
    private String redirectUri;

    @GetMapping("/auth/link")
    public String getAuthLink(HttpSession session) throws NoSuchAlgorithmException, URISyntaxException {
        String codeVerifier = PKCEUtil.generateCodeVerifier();
        String codeChallenge = PKCEUtil.generateCodeChallenge(codeVerifier);
        session.setAttribute("codeVerifier", codeVerifier);

        URI uri = new URI(String.format(
                "%s/oauth2/v2.0/authorize?client_id=%s&response_type=code&redirect_uri=%s&response_mode=query&scope=openid%%20profile%%20offline_access%%20https://graph.microsoft.com/.default&code_challenge=%s&code_challenge_method=S256",
                authority, clientId, redirectUri, codeChallenge));

        return uri.toString();
    }

    @GetMapping("/auth/callback")
    public String authCallback(@RequestParam("code") String code, HttpSession session) {
        String codeVerifier = (String) session.getAttribute("codeVerifier");

        // Exchange the authorization code for an access token using the codeVerifier
        // Here you would make a request to the token endpoint with the code and
        // codeVerifier

        return "Authorization code received: " + code + "\nCode Verifier: " + codeVerifier;
    }
}