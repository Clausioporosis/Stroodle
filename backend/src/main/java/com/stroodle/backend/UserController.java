package com.stroodle.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    // HTTP-Methoden für Benutzer
    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<User> addUser(@RequestBody User user) {
        User savedUser = userService.createUser(user);
        return ResponseEntity.ok(savedUser);
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/search/email")
    public ResponseEntity<List<User>> findByEmail(@RequestParam String email) {
        List<User> users = userService.getUserByEmail(email);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/search/name")
    public ResponseEntity<List<User>> findByName(@RequestParam String name) {
        List<User> users = userService.getUserByName(name);
        return ResponseEntity.ok(users);
    }
}
