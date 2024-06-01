package com.stroodle.backend.service;

import com.stroodle.backend.repository.AzureTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

@Service
public class OutlookService {

    @Autowired
    private AzureTokenRepository tokenRepository;

    @Autowired
    private AzureTokenService tokenService;

    @Value("${azure.graph.endpoint}")
    private String graphEndpoint;

    public String getCalendarEvents(String userId) throws Exception {
        String accessToken = tokenService.getAccessToken(userId);
        String url = graphEndpoint + "/v1.0/me/events";

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

        return response.getBody();
    }

    public String getUserProfile(String userId) throws Exception {
        String accessToken = tokenService.getAccessToken(userId);
        String url = graphEndpoint + "/v1.0/me";

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

        return response.getBody();
    }
}
