package com.stroodle.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
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
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    public List<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> getUserByName(String name) {
        return userRepository.findByName(name);
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