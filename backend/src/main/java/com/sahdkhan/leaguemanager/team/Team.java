package com.sahdkhan.leaguemanager.team;

import com.sahdkhan.leaguemanager.league.League;
import jakarta.persistence.*;

import java.util.UUID;

@Entity
public class Team {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String name;

    @ManyToOne(optional = false)
    private League league;

    protected Team() {}

    public Team(String name, League league) {
        this.name = name;
        this.league = league;
    }

    public UUID getId() { return id; }
    public String getName() { return name; }
    public League getLeague() { return league; }
}
