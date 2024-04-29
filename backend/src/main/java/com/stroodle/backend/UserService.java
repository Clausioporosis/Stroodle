package com.stroodle.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

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

    public List<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> getUserByName(String name) {
        return userRepository.findByName(name);
    }

    // Methoden zur Verwaltung von Benutzern
}
