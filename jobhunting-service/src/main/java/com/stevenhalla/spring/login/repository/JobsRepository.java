package com.stevenhalla.spring.login.repository;

import com.stevenhalla.spring.login.models.Jobs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobsRepository extends JpaRepository<Jobs, Long> {

    List<Jobs> findByUserId(Long userId);

    // Adjusted query to include jobs where jobsoftdelete is false or null
    @Query("SELECT j FROM Jobs j WHERE j.jobsoftdelete IS NULL OR j.jobsoftdelete = false")
    List<Jobs> findAllActiveJobs();
}
