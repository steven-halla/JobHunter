package com.stevenhalla.spring.login.controllers;

import com.stevenhalla.spring.login.models.Weed;
import com.stevenhalla.spring.login.repository.WeedRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/weeds")
public class WeedController {

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
        return weedRepository.findByWeedName(weedname);
    }

    @PostMapping
    public Weed createWeed(@RequestBody Weed weed) {
        // You may want to add checks to prevent duplicates
        if (!weedRepository.existsByWeedName(weed.getWeedName())) {
            return weedRepository.save(weed);
        } else {
            // Return some kind of error message or code
            throw new RuntimeException("Error: Weed is already in use!");
        }
    }

    @PutMapping("/{id}")
    public Weed updateWeed(@RequestBody Weed updatedWeed, @PathVariable Long id) {
        return weedRepository.findById(id)
                .map(weed -> {
                    weed.setWeedName(updatedWeed.getWeedName());
                    // Add here the other properties of Weed that need to be updated
                    return weedRepository.save(weed);
                })
                .orElseGet(() -> {
                    updatedWeed.setId(id);
                    return weedRepository.save(updatedWeed);
                });
    }

    @DeleteMapping("/{id}")
    public void deleteWeed(@PathVariable Long id) {
        weedRepository.deleteById(id);
    }
}
