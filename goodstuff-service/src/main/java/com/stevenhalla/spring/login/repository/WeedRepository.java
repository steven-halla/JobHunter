package com.stevenhalla.spring.login.repository;

import com.stevenhalla.spring.login.models.User;
import com.stevenhalla.spring.login.models.Weed;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.support.WebExchangeDataBinder;

import java.util.Optional;
@Repository
public interface WeedRepository extends JpaRepository<Weed, Long> {
    Optional<Weed> findByWeedName(String weedname);

    Boolean existsByWeedName(String weedname);
}


