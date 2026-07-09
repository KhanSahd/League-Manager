package com.sahdkhan.leaguemanager.league;

import com.sahdkhan.leaguemanager.sports.Sport;
import jakarta.persistence.*;
import java.util.UUID;

/**
 * Represents a sports league with a unique identifier, name, and sport type.
 */
@Entity
public class League {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String name;

    @ManyToOne(optional = false)
    @JoinColumn(name = "sport_id", nullable = false)
    private Sport sport;

    protected League() {}

    public League(String name, Sport sport) {
        this.name = name;
        this.sport = sport;
    }

    public UUID getId() { return id; }
    public String getName() { return name; }
    public Sport getSport() { return sport; }

    public void setName( String name) { this.name = name; }
    public void setSport( Sport sport) { this.sport = sport; }
}
