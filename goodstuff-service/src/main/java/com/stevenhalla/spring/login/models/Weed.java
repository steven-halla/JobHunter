package com.stevenhalla.spring.login.models;
import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

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

    public Weed() {
    }

    public Weed(String weedname) {
        this.weedname = weedname;
    }

    public long getId() {return id;}

    public void setId(Long id) {this.id = id;}

    public String getWeedname() {return weedname;}

    public void setWeedname(String weedname) {this.weedname = weedname;}
}
