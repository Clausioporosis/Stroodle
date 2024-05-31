package com.stroodle.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stroodle.backend.model.UserDto;
import com.stroodle.backend.service.UserService;

import java.util.List;

@CrossOrigin(origins = "${app.origin}")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<UserDto> getUsers() {
        return userService.getUsers();
    }

    @GetMapping("/{userId}")
    public UserDto getUserById(@PathVariable String userId) {
        return userService.getUserById(userId);
    }

    @GetMapping("/search")
    public List<UserDto> searchUsers(String query) {
        return userService.searchUsers(query);
    }
}