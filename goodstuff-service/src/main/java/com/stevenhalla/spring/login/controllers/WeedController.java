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
        return weedRepository.findByWeedname(weedname);
    }

    @PostMapping
    public Weed createWeed(@RequestBody Weed weed) {
        if (!weedRepository.existsByWeedname(weed.getWeedname())) {
            return weedRepository.save(weed);
        } else {
            throw new RuntimeException("Error: Weed is already in use!");
        }
    }



    @DeleteMapping("/{id}")
    public void deleteWeed(@PathVariable Long id) {
        weedRepository.deleteById(id);
    }
}
