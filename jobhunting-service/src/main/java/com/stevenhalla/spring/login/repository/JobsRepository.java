package com.stevenhalla.spring.login.repository;

import com.stevenhalla.spring.login.models.Jobs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobsRepository extends JpaRepository<Jobs, Long> {

    // Method to find jobs by user ID considering jobsoftdelete
    @Query("SELECT j FROM Jobs j WHERE j.user.id = :userId AND (j.jobsoftdelete IS NULL OR j.jobsoftdelete = false)")
    List<Jobs> findActiveJobsByUserId(Long userId);

    // Existing method to find all active jobs
    @Query("SELECT j FROM Jobs j WHERE j.jobsoftdelete IS NULL OR j.jobsoftdelete = false")
    List<Jobs> findAllActiveJobs();
}

