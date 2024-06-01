package com.stroodle.backend.service;

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
    private AzureTokenService tokenService;

    @Value("${azure.graph.endpoint}")
    private String graphEndpoint;

    // except for user data, calender events (and else) cannot be retrieved from
    // Graph API ->
    //
    // Error fetching events: Failed to retrieve calendar events: 401 Unauthorized:
    // "{"error":{"code":"OrganizationFromTenantGuidNotFound","message":"The tenant
    // for tenant guid '9fd843f0-d6da-45c8-a7dd-a76889e41055' does not
    // exist.","innerError":{"oAuthEventOperationId":"bb459b22-b9f6-4380-88bf-cb072e06716a","oAuthEventcV":"XBvLJC92WMqoiX5/q84blA.1.1,
    // XBvLJC92WMqoiX5/q84blA.1","errorUrl":"https://aka.ms/autherrors#error-InvalidTenant","requestId":"e686618d-940b-47d8-9735-7cc7873a276f","date":"2024-06-01T16:18:38"}}}"
    //
    // god knows why, but it's maybe because of missing 365 subscription license or
    // something completely different. But ay, I tried.

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
