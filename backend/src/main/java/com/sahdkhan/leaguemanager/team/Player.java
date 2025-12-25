package com.sahdkhan.leaguemanager.team;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
public class Player {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String name;

    @ManyToOne(optional = false)
    private Team team;

    protected Player() {}

    public Player(String name, Team team) {
        this.name = name;
        this.team = team;
    }

    public UUID getId() { return id; }
    public String getName() { return name; }
    public Team getTeam() { return team; }
}
