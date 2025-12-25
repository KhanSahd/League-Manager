package com.sahdkhan.leaguemanager.league;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
public class League {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String sport;

    protected League() {}

    public League(String name, String sport) {
        this.name = name;
        this.sport = sport;
    }

    public UUID getId() { return id; }
    public String getName() { return name; }
    public String getSport() { return sport; }
}
