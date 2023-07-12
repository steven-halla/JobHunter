package com.stevenhalla.spring.login.controllers;

import com.stevenhalla.spring.login.models.User;
import com.stevenhalla.spring.login.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/usernames")
    public List<String> getAllUsernames() {
        List<User> users = userRepository.findAll();
        return users.stream().map(User::getUsername).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public String getUsernameById(@PathVariable Long id) {
        return userRepository.findById(id).map(User::getUsername)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        if (!userRepository.existsByUsername(user.getUsername())) {
            return userRepository.save(user);
        } else {
            throw new RuntimeException("Error: Username is already in use!");
        }
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
    }
}
