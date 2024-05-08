package com.stroodle.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.stroodle.backend.exception.ResourceNotFoundException;
import com.stroodle.backend.model.User;
import com.stroodle.backend.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public User createUser(User user) {
        if (user.getId() != null && userRepository.existsById(user.getId())) {
            throw new DataIntegrityViolationException("User with ID " + user.getId() + " already exists.");
        }
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        List<User> users = userRepository.findAll();
        if (users.isEmpty()) {
            throw new ResourceNotFoundException("No users found.");
        }
        return users;
    }

    public Optional<User> getUserById(String id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id " + id);
        }
        return userRepository.findById(id);
    }

    public List<User> getUserByEmail(String email) {
        List<User> users = userRepository.findByEmail(email);
        if (users.isEmpty()) {
            throw new ResourceNotFoundException("No user found with the email " + email);
        }
        return users;
    }

    public List<User> getUserByName(String name) {
        List<User> users = userRepository.findByName(name);
        if (users.isEmpty()) {
            throw new ResourceNotFoundException("No user found with the name " + name);
        }
        return users;
    }

    public User updateUser(User user) {
        userRepository.findById(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + user.getId()));
        return userRepository.save(user);
    }

    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id " + id);
        }
        userRepository.deleteById(id);
    }

    // Methoden zur Verwaltung von Benutzern
}
