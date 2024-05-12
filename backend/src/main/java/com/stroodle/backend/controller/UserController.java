package com.stroodle.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.stroodle.backend.model.Availability;
import com.stroodle.backend.model.User;
import com.stroodle.backend.service.UserService;

import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/users")
public class UserController {
    // HTTP-Methoden für Benutzer
    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<User> addUser(@Valid @RequestBody User user) {
        User savedUser = userService.createUser(user);
        return ResponseEntity.ok(savedUser);
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/search/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        Optional<User> user = userService.getUserById(id);
        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/search/query")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String query) {
        List<User> users = userService.searchUsers(query);
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/search/email")
    public ResponseEntity<List<User>> findByEmail(@RequestParam String email) {
        List<User> users = userService.getUserByEmail(email);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/search/firstName")
    public ResponseEntity<List<User>> findByFirstName(@RequestParam String name) {
        List<User> users = userService.getUserByFirstName(name);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/search/lastName")
    public ResponseEntity<List<User>> findByLastName(@RequestParam String name) {
        List<User> users = userService.getUserByLastName(name);
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody User user) {
        user.setId(id);
        User updatedUser = userService.updateUser(user);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/availability")
    public ResponseEntity<?> updateAvailability(@PathVariable String id, @RequestBody Availability availability) {
        Optional<User> optionalUser = userService.getUserById(id);
        if (!optionalUser.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        User user = optionalUser.get();
        user.setAvailability(availability);
        userService.updateUser(user);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/search/{id}/availability")
    public ResponseEntity<Availability> getAvailability(@PathVariable String id) {
        Optional<User> optionalUser = userService.getUserById(id);
        if (!optionalUser.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        User user = optionalUser.get();
        return ResponseEntity.ok(user.getAvailability());
    }

}
