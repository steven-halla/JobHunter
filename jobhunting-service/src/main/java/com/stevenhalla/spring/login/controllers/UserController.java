package com.stevenhalla.spring.login.controllers;

import com.stevenhalla.spring.login.models.Jobs;
import com.stevenhalla.spring.login.models.User;
import com.stevenhalla.spring.login.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    public static class CustomFields {
        public String customfield1;
        public String customfield2;
        public String customfield3;

    }

    public static class LifeStory {
        public String lifestory; // Change to lowercase 'lifestory'
    }

    public static class UserUpdateRequest {
        public CustomFields customFields;
        public String lifestory; // Change to lowercase 'lifestory'
    }

    @GetMapping("/allusers")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }


    @PatchMapping("/updateuser/{userid}")
    public User modifyUserCustomFields(@PathVariable Long userid, @RequestBody UserUpdateRequest request) {
        Optional<User> optionalUser = userRepository.findById(userid);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            CustomFields customFields = request.customFields;

            // Update custom fields
            user.setCustomfield1(customFields.customfield1);
            user.setCustomfield2(customFields.customfield2);
            user.setCustomfield3(customFields.customfield3);

            // Update lifestory (with lowercase 's')
            user.setLifeStory(request.lifestory.toLowerCase()); // Convert to lowercase before setting

            userRepository.save(user);
            return user;
        } else {
            throw new RuntimeException("Error: User not found with ID: " + userid);
        }
    }






    @PatchMapping("/updateLifestory/{userId}")
    public User updateLifeStory(@PathVariable Long userId, @RequestBody String lifeStory) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setLifeStory(lifeStory);
            userRepository.save(user);
            return user;
        } else {
            throw new RuntimeException("Error: User not found with ID: " + userId);
        }
    }

    @GetMapping("/lifestory/{userId}")
    public String getLifeStory(@PathVariable Long userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            return optionalUser.get().getLifeStory();
        } else {
            throw new RuntimeException("Error: User not found with ID: " + userId);
        }
    }

    // In UserController.java (in com.stevenhalla.spring.login.controllers package)

    @PostMapping("/{userId}/lifestory")
    public User addLifeStoryToUser(@PathVariable Long userId, @RequestBody String lifeStory) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setLifeStory(lifeStory); // Assuming the User class has a setLifeStory method
            userRepository.save(user);
            return user;
        } else {
            throw new RuntimeException("Error: User not found with ID: " + userId);
        }
    }








    @GetMapping("/customfields")
    public List<String> getUserCustomFields() {
        List<User> users = userRepository.findAll();
        List<String> userCustomFields = new ArrayList<>();

        for (User user : users) {
            userCustomFields.add(user.getCustomfield1());
            userCustomFields.add(user.getCustomfield2());
            userCustomFields.add(user.getCustomfield3());
            userCustomFields.add(user.getLifeStory());
        }

        return userCustomFields;
    }


    @GetMapping("/usernames")
    public List<String> getAllUsernames() {
        List<User> users = userRepository.findAll();
        return users.stream().map(User::getUsername).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public Optional<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id);
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

    // Additional method to handle assigning a job to a user
    @PostMapping("/{userId}/jobs")
    public User assignJobToUser(@PathVariable Long userId, @RequestBody Jobs job) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            job.setUser(user);
            user.getJobs().add(job);
            userRepository.save(user);
            return user;
        } else {
            throw new RuntimeException("Error: User not found with ID: " + userId);
        }
    }
}

