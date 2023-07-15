package com.stevenhalla.spring.login.repository;


import com.stevenhalla.spring.login.models.UserWeed;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserWeedRepository extends JpaRepository<UserWeed, Long> {
    // Add any custom query methods here if you need them
    List<UserWeed> findByUserId(Long userId);

}
