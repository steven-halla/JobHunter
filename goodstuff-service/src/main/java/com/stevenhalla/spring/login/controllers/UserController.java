package com.stevenhalla.spring.login.controllers;

import com.stevenhalla.spring.login.models.User;
import com.stevenhalla.spring.login.models.Weed;
import com.stevenhalla.spring.login.repository.UserRepository;
import com.stevenhalla.spring.login.repository.WeedRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WeedRepository weedRepository;

    @GetMapping("/usernames")
    public List<String> getAllUsernames() {
        List<User> users = userRepository.findAll();
        return users.stream().map(User::getUsername).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public Optional<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id);
    }
//I dont think this even does anything I might have to delete this?
    @PostMapping
    public User createUser(@RequestBody User user) {
        if (!userRepository.existsByUsername(user.getUsername())) {
            return userRepository.save(user);
        } else {
            throw new RuntimeException("Error: Username is already in use!");
        }
    }

    @PostMapping("/{userId}/weeds")
    public Weed createWeed(@PathVariable Long userId, @RequestBody Weed weed) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        if (!weedRepository.existsByWeedname(weed.getWeedname())) {
            weed.setUser(user);
            return weedRepository.save(weed);
        } else {
            throw new RuntimeException("Error: Weed is already in use!");
        }
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
    }
}
