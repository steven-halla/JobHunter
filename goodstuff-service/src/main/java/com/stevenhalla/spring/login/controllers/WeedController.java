package com.stevenhalla.spring.login.controllers;

import com.stevenhalla.spring.login.models.User;
import com.stevenhalla.spring.login.models.Weed;
import com.stevenhalla.spring.login.repository.UserRepository;
import com.stevenhalla.spring.login.repository.WeedRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000") // Replace with your frontend URL

@RequestMapping("/api/weeds")
public class WeedController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WeedRepository weedRepository;

    @GetMapping
    public List<Weed> getAllWeeds() {
        return weedRepository.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Weed> getWeedById(@PathVariable Long id) {
        return weedRepository.findById(id);
    }

    @GetMapping("/name/{weedname}")
    public Optional<Weed> getWeedByName(@PathVariable String weedname) {
        return weedRepository.findByWeedname(weedname);
    }
//here I had to set lanague level to 11, be sure to reverse this here if needed




    @DeleteMapping("/{id}")
    public void deleteWeed(@PathVariable Long id) {
        weedRepository.deleteById(id);
    }

    @GetMapping("/user/{userId}")
    public List<Weed> getWeedsByUserId(@PathVariable Long userId) {
        return weedRepository.findByUserId(userId);
    }


    @PostMapping("/{userId}")
    public ResponseEntity<Weed> createUserWeed(@PathVariable Long userId, @RequestBody Weed newWeed) {
        Optional<User> optionalUser = userRepository.findById(userId);

        if(optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = optionalUser.get();
        newWeed.setUser(user);

        if (!weedRepository.existsByWeedname(newWeed.getWeedname())) {
            // Assuming you're passing the rating in your request body
            newWeed.setRating(newWeed.getRating());
            weedRepository.save(newWeed);
            return ResponseEntity.ok(newWeed);
        } else {
            throw new RuntimeException("Error: Weed is already in use!");
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Weed> updateWeed(@PathVariable Long id, @RequestBody Weed updatedWeed) {
        Optional<Weed> optionalWeed = weedRepository.findById(id);

        if(optionalWeed.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Weed existingWeed = optionalWeed.get();

        if (updatedWeed.getWeedname() != null) {
            existingWeed.setWeedname(updatedWeed.getWeedname());
        }

        // New logic to update rating
        if (updatedWeed.getRating() > 0) {
            existingWeed.setRating(updatedWeed.getRating());
        }

        weedRepository.save(existingWeed);
        return ResponseEntity.ok(existingWeed);
    }




}

