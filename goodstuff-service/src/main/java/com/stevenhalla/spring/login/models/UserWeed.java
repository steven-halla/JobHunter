package com.stevenhalla.spring.login.models;
import javax.persistence.*;

@Entity
@Table(name = "user_weeds")
public class UserWeed {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToOne
    @JoinColumn(name = "weed_id")
    private Weed weed;

    // Other fields as necessary...

    public UserWeed() {
    }

    public UserWeed(User user, Weed weed) {
        this.user = user;
        this.weed = weed;
    }

    // Getters and setters...
}
