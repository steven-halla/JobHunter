package com.stevenhalla.spring.login.models;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

//look up java record classses

@Entity
@Table(name = "users",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "username"),
                @UniqueConstraint(columnNames = "email")
        })
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 30)
    private String username;

    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    @NotBlank
    @Size(max = 120)
    private String password;

    @Size(max = 333)
    private String customfield1;

    @Size(max = 333)
    private String customfield2;

    @Size(max = 333)
    private String customfield3;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Jobs> jobs = new ArrayList<>();

    @Size(max = 5000)
    private String lifestory;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();


    public User() {
    }

    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    // Getters and setters...

    public Long getId() {
        return id;
    }

    public Set<Role> getRoles() {
        return roles;
    }




    public void setId(Long id) {
        this.id = id;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }


    public String getUsername() {
        return username;
    }


    public String getUserCustomFields() {
        return customfield1 + ", " + customfield2 + ", " + customfield3;
    }

    public String getCustomfield1() {
        return customfield1;
    }

    public void setCustomfield1(String customfield1) {
        this.customfield1 = customfield1;
    }

    public String getCustomfield2() {
        return customfield2;
    }

    public void setCustomfield2(String customfield2) {
        this.customfield2 = customfield2;
    }

    public String getCustomfield3() {
        return customfield3;
    }

    public void setCustomfield3(String customfield3) {
        this.customfield3 = customfield3;
    }

    public String getLifeStory() {return lifestory;}

    public void setLifeStory(String lifeStory) {
        this.lifestory = lifeStory;
    }

    public void setUsername(String username) {
        this.username = username;
    }




    // ... existing constructors, getters, and setters ...



    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<Jobs> getJobs() {
        return jobs;
    }

    public void setJobs(List<Jobs> jobs) {
        this.jobs = jobs;
    }
}
