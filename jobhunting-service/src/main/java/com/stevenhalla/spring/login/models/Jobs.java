package com.stevenhalla.spring.login.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Entity
@Table(name = "jobs")
public class Jobs {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "companyname")
    private String companyname;

    @NotBlank
    @Column(name = "description")
    private String description;

    @NotBlank
    @Column(name = "jobposter")
    private String jobposter;

    @NotBlank
    @Column(name = "primarycontact")
    private String primarycontact;

    @NotBlank
    @Column(name = "companywebsitelink")
    private String companywebsitelink;

    @NotBlank
    @Column(name = "joblink")
    private String joblink;

    @NotBlank
    @Column(name = "meetinglink")
    private String meetinglink;

    @NotBlank
    @Column(name = "interviewnotes")
    private String interviewnotes;

    @NotBlank
    @Column(name = "customfield")
    private String customfield;

    @NotBlank
    @Column(name = "interviewernames")
    private String interviewernames;

    @NotNull
    @Column(name = "dateapplied")
    private Date dateapplied;

    @NotNull
    @Column(name = "interviewdate")
    private Date interviewdate;

    @NotNull
    @Column(name = "companyresponded")
    private Boolean companyresponded;

    @NotNull
    @Column(name = "companyrejected")
    private Boolean companyrejected;



    @JsonIgnore
    @ManyToOne
    @JoinColumn(name="userid", nullable=false)
    private User user;

    public Jobs(String companyname, User user) {
        this.companyname = companyname;

        this.user = user;
    }
//this is the correct one below
//    public Jobs(String jobtitle, String description, String jobposter, User user) {
//        this.jobtitle = jobtitle;
//        this.description = description;
//        this.jobposter = jobposter;
//        this.user = user;
//    }

    public Jobs() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCompanyname() {
        return companyname;
    }

    public void setCompanyname(String companyname) {
        this.companyname = companyname;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getJobposter() {
        return jobposter;
    }

    public void setJobposter(String jobposter) {
        this.jobposter = jobposter;
    }

    public String getPrimarycontact() {
        return primarycontact;
    }

    public void setPrimarycontact(String primarycontact) {
        this.primarycontact = primarycontact;
    }

    public String getCompanywebsitelink() {
        return companywebsitelink;
    }

    public void setCompanywebsitelink(String companywebsitelink) {
        this.companywebsitelink = companywebsitelink;
    }

    public String getJoblink() {
        return joblink;
    }

    public void setJoblink(String joblink) {
        this.joblink = joblink;
    }

    public String getMeetingLink() {
        return meetinglink;
    }

    public void setMeetinglink(String meetinglink) {
        this.meetinglink = meetinglink;
    }

    public String getInterviewnotes() {
        return interviewnotes;
    }

    public void setInterviewnotes(String interviewnotes) {
        this.interviewnotes = interviewnotes;
    }

    public String getCustomfield() {
        return customfield;
    }

    public void setCustomfield(String customfield) {
        this.customfield = customfield;
    }

    public String getInterviewernames() {
        return interviewernames;
    }

    public void setInterviewernames(String interviewernames) {
        this.interviewernames = interviewernames;
    }

    public Date getDateapplied() {
        return dateapplied;
    }

    public void setDateapplied(Date dateapplied) {
        this.dateapplied = dateapplied;
    }

    public Date getInterviewdate() {
        return interviewdate;
    }

    public void setInterviewdate(Date interviewdate) {
        this.interviewdate = interviewdate;
    }

    public Boolean getCompanyresponded() {
        return companyresponded;
    }

    public void setCompanyresponded(Boolean companyresponded) {
        this.companyresponded = companyresponded;
    }

    public Boolean getCompanyrejected() {
        return companyrejected;
    }



    public void setCompanyrejected(Boolean companyrejected) {
        this.companyrejected = companyrejected;
    }




    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
