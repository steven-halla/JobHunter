package com.stevenhalla.spring.login.repository;


import com.stevenhalla.spring.login.models.Jobs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobsRepository extends JpaRepository<Jobs, Long> {

    List<Jobs> findByUserId(Long userId);
}
