package com.stevenhalla.spring.login.repository;

import com.stevenhalla.spring.login.models.Weed;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WeedRepository extends JpaRepository<Weed, Long> {
    Optional<Weed> findByWeedname(String weedname);

    Boolean existsByWeedname(String weedname);

    List<Weed> findByUserId(Long userId);
}
