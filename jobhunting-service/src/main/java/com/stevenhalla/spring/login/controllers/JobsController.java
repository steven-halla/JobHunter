package com.stevenhalla.spring.login.controllers;

import com.stevenhalla.spring.login.models.Jobs;
import com.stevenhalla.spring.login.repository.JobsRepository;
import com.stevenhalla.spring.login.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/jobs")
public class JobsController {

    @Autowired
    private JobsRepository jobsRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Jobs> getAllJobs() {
        // Replace findAll() with findAllActiveJobs()
        return jobsRepository.findAllActiveJobs();
    }

    @GetMapping("/{id}")
    public Optional<Jobs> getJobById(@PathVariable Long id) {
        return jobsRepository.findById(id);
    }

    @PostMapping("/createjob/{userId}")
    public Jobs createJob(@PathVariable Long userId, @RequestBody Jobs job) {
        return userRepository.findById(userId).map(user -> {
            job.setUser(user);
            return jobsRepository.save(job);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PatchMapping("/update/{id}")
    public Jobs updateJob(@PathVariable Long id, @RequestBody Jobs jobUpdate) {
        return jobsRepository.findById(id).map(job -> {

            if (jobUpdate.getCompanyname() != null) job.setCompanyname(jobUpdate.getCompanyname());
            if (jobUpdate.getDescription() != null) job.setDescription(jobUpdate.getDescription());
            if (jobUpdate.getJobposter() != null) job.setJobposter(jobUpdate.getJobposter());
            if (jobUpdate.getPrimarycontact() != null) job.setPrimarycontact(jobUpdate.getPrimarycontact());
            if (jobUpdate.getCompanywebsitelink() != null) job.setCompanywebsitelink(jobUpdate.getCompanywebsitelink());
            if (jobUpdate.getJoblink() != null) job.setJoblink(jobUpdate.getJoblink());
            if (jobUpdate.getMeetingLink() != null) job.setMeetinglink(jobUpdate.getMeetingLink());
            if (jobUpdate.getCustomfield() != null) job.setCustomfield(jobUpdate.getCustomfield());
            if (jobUpdate.getDateapplied() != null) job.setDateapplied(jobUpdate.getDateapplied());
            if (jobUpdate.getCompanyresponded() != null) job.setCompanyresponded(jobUpdate.getCompanyresponded());
            if (jobUpdate.getCompanyrejected() != null) job.setCompanyrejected(jobUpdate.getCompanyrejected());
            if (jobUpdate.getJobSoftDelete() != null) job.setJobSoftDelete(jobUpdate.getJobSoftDelete());
            if (jobUpdate.getInterviewnotes() != null) job.setInterviewnotes(jobUpdate.getInterviewnotes());
            if (jobUpdate.getInterviewernames() != null) job.setInterviewernames(jobUpdate.getInterviewernames());
            if (jobUpdate.getInterviewdate() != null) job.setInterviewdate(jobUpdate.getInterviewdate());

            if (jobUpdate.getInterviewbegintime() != null) job.setInterviewbegintime(jobUpdate.getInterviewbegintime());
            if (jobUpdate.getInterviewendtime() != null) job.setInterviewendtime(jobUpdate.getInterviewendtime());
            System.out.println("Received jobUpdate: " + jobUpdate); // Log the received payload



            return jobsRepository.save(job);
        }).orElseThrow(() -> new RuntimeException("Job not found"));
    }


    @DeleteMapping("/{id}")
    public void deleteJob(@PathVariable Long id) {
        if (jobsRepository.existsById(id)) {
            jobsRepository.deleteById(id);
        } else {
            throw new RuntimeException("Job not found");
        }
    }
}
