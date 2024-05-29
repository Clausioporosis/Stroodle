package com.stroodle.backend.service;
/*
 * import com.fasterxml.jackson.core.JsonProcessingException;
 * import com.fasterxml.jackson.core.type.TypeReference;
 * import com.fasterxml.jackson.databind.ObjectMapper;
 * import com.stroodle.backend.config.KeycloakConfig;
 * import com.stroodle.backend.model.TimePeriod;
 * import org.keycloak.admin.client.Keycloak;
 * import org.keycloak.representations.idm.UserRepresentation;
 * import org.springframework.stereotype.Service;
 * 
 * import java.util.Collections;
 * import java.util.HashMap;
 * import java.util.List;
 * import java.util.Map;
 * import java.time.DayOfWeek;
 * import java.util.stream.Collectors;
 * 
 * @Service
 * public class UserService {
 * 
 * private final KeycloakConfig keycloakConfig;
 * private final ObjectMapper objectMapper;
 * 
 * public UserService(KeycloakConfig keycloakConfig, ObjectMapper objectMapper)
 * {
 * this.keycloakConfig = keycloakConfig;
 * this.objectMapper = objectMapper;
 * this.objectMapper.registerModule(new
 * com.fasterxml.jackson.datatype.jsr310.JavaTimeModule());
 * }
 * 
 * public List<UserRepresentation> getAllUsers(String token) {
 * return keycloakConfig.createKeycloak(token).realm("Stroodle").users().list();
 * }
 * 
 * public UserRepresentation getUserById(String token, String userId) {
 * Keycloak keycloak = keycloakConfig.createKeycloak(token);
 * UserRepresentation user =
 * keycloak.realm("Stroodle").users().get(userId).toRepresentation();
 * return user;
 * }
 * 
 * public List<UserRepresentation> searchUsers(String token, String searchTerm)
 * {
 * Keycloak keycloak = keycloakConfig.createKeycloak(token);
 * List<UserRepresentation> allUsers =
 * keycloak.realm("Stroodle").users().list();
 * return allUsers.stream()
 * .filter(user -> user.getUsername().contains(searchTerm)
 * || (user.getFirstName() != null && user.getFirstName().contains(searchTerm))
 * || (user.getLastName() != null && user.getLastName().contains(searchTerm))
 * || (user.getEmail() != null && user.getEmail().contains(searchTerm)))
 * .collect(Collectors.toList());
 * }
 * 
 * public void setUserAvailability(String token, String userId, Map<DayOfWeek,
 * List<TimePeriod>> availability)
 * throws JsonProcessingException {
 * Keycloak keycloak = keycloakConfig.createKeycloak(token);
 * UserRepresentation user =
 * keycloak.realm("Stroodle").users().get(userId).toRepresentation();
 * 
 * String availabilityJson = objectMapper.writeValueAsString(availability);
 * System.out.println("Setting availability: " + availabilityJson);
 * 
 * Map<String, List<String>> attributes = user.getAttributes();
 * if (attributes == null) {
 * attributes = new HashMap<>();
 * }
 * attributes.put("availability", Collections.singletonList(availabilityJson));
 * user.setAttributes(attributes);
 * 
 * keycloak.realm("Stroodle").users().get(userId).update(user);
 * }
 * 
 * public Map<DayOfWeek, List<TimePeriod>> getUserAvailability(String token,
 * String userId)
 * throws JsonProcessingException {
 * Keycloak keycloak = keycloakConfig.createKeycloak(token);
 * UserRepresentation user =
 * keycloak.realm("Stroodle").users().get(userId).toRepresentation();
 * 
 * Map<String, List<String>> attributes = user.getAttributes();
 * if (attributes == null || !attributes.containsKey("availability")) {
 * return null;
 * }
 * 
 * String availabilityJson = attributes.get("availability").get(0);
 * System.out.println("Retrieved availability: " + availabilityJson);
 * 
 * return objectMapper.readValue(availabilityJson, new
 * TypeReference<Map<DayOfWeek, List<TimePeriod>>>() {
 * });
 * }
 * }
 */
