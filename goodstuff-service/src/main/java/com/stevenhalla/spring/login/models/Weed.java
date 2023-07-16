package com.stevenhalla.spring.login.models;

import javax.persistence.*;
import javax.validation.constraints.*;

@Entity
@Table(name = "weeds",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "weedname")
        })
public class Weed {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 30)
    private String weedname;

    @Min(1)
    @Max(5)
    private int rating;

    @ManyToOne
    @JoinColumn(name="user_id")
    private User user;

    public Weed() {
    }

    public Weed(String weedname, User user, int rating) {
        this.weedname = weedname;
        this.user = user;
        this.rating = rating;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getWeedname() {
        return weedname;
    }

    public void setWeedname(String weedname) {
        this.weedname = weedname;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
