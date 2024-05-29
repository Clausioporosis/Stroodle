package com.stroodle.backend.controller;
/*
 * import com.stroodle.backend.model.TimePeriod;
 * import com.stroodle.backend.service.UserService;
 * import org.keycloak.representations.idm.UserRepresentation;
 * import org.springframework.beans.factory.annotation.Autowired;
 * import org.springframework.http.ResponseEntity;
 * import org.springframework.security.access.prepost.PreAuthorize;
 * import org.springframework.security.core.Authentication;
 * import org.springframework.security.core.context.SecurityContextHolder;
 * import org.springframework.security.oauth2.jwt.Jwt;
 * import org.springframework.web.bind.annotation.*;
 * import com.fasterxml.jackson.core.JsonProcessingException;
 * 
 * import java.util.List;
 * import java.util.Map;
 * import java.time.DayOfWeek;
 * 
 * @CrossOrigin(origins = "http://localhost:3000")
 * 
 * @RestController
 * 
 * @RequestMapping("/api/users")
 * public class UserController {
 * 
 * private final UserService userService;
 * 
 * public UserController(UserService userService) {
 * this.userService = userService;
 * }
 * 
 * private String extractToken() {
 * Authentication authentication =
 * SecurityContextHolder.getContext().getAuthentication();
 * Jwt jwt = (Jwt) authentication.getPrincipal();
 * return jwt.getTokenValue();
 * }
 * 
 * @GetMapping
 * 
 * @PreAuthorize("hasRole('client_admin')")
 * public ResponseEntity<List<UserRepresentation>> getAllUsers() {
 * String token = extractToken();
 * List<UserRepresentation> users = userService.getAllUsers(token);
 * return ResponseEntity.ok(users);
 * }
 * 
 * @GetMapping("/{id}")
 * 
 * @PreAuthorize("hasRole('client_admin')")
 * public ResponseEntity<UserRepresentation> getUserById(@PathVariable String
 * id) {
 * String token = extractToken();
 * UserRepresentation user = userService.getUserById(token, id);
 * return ResponseEntity.ok(user);
 * }
 * 
 * @GetMapping("/search")
 * 
 * @PreAuthorize("hasRole('client_admin')")
 * public ResponseEntity<List<UserRepresentation>> searchUsers(@RequestParam
 * String searchTerm) {
 * String token = extractToken();
 * List<UserRepresentation> users = userService.searchUsers(token, searchTerm);
 * return ResponseEntity.ok(users);
 * }
 * 
 * @PostMapping("/{id}/availability")
 * 
 * @PreAuthorize("hasRole('client_admin')")
 * public ResponseEntity<Void> setUserAvailability(@PathVariable String id,
 * 
 * @RequestBody Map<DayOfWeek, List<TimePeriod>> availability) throws
 * JsonProcessingException {
 * String token = extractToken();
 * userService.setUserAvailability(token, id, availability);
 * return ResponseEntity.ok().build();
 * }
 * 
 * @GetMapping("/{id}/availability")
 * 
 * @PreAuthorize("hasRole('client_admin')")
 * public ResponseEntity<Map<DayOfWeek, List<TimePeriod>>>
 * getUserAvailability(@PathVariable String id)
 * throws JsonProcessingException {
 * String token = extractToken();
 * Map<DayOfWeek, List<TimePeriod>> availability =
 * userService.getUserAvailability(token, id);
 * return ResponseEntity.ok(availability);
 * }
 * }
 */