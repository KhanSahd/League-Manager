package com.sahdkhan.leaguemanager.season;

import com.sahdkhan.leaguemanager.league.League;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.UUID;

/**
 * A single run of a league (e.g. "Fall 2026"). Rosters, games, and stats are
 * all scoped to a season so a league can run repeatedly without losing history.
 */
@Entity
public class Season {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "league_id", nullable = false)
    private League league;

    @Column(nullable = false)
    private String name;

    @Column(name = "starts_on")
    private LocalDate startsOn;

    @Column(name = "ends_on")
    private LocalDate endsOn;

    @Column(name = "is_active", nullable = false)
    private boolean active;

    protected Season() {}

    public Season(League league, String name, LocalDate startsOn, LocalDate endsOn, boolean active) {
        this.league = league;
        this.name = name;
        this.startsOn = startsOn;
        this.endsOn = endsOn;
        this.active = active;
    }

    public UUID getId() { return id; }
    public League getLeague() { return league; }
    public String getName() { return name; }
    public LocalDate getStartsOn() { return startsOn; }
    public LocalDate getEndsOn() { return endsOn; }
    public boolean isActive() { return active; }

    public void setName(String name) { this.name = name; }
    public void setStartsOn(LocalDate startsOn) { this.startsOn = startsOn; }
    public void setEndsOn(LocalDate endsOn) { this.endsOn = endsOn; }
    public void setActive(boolean active) { this.active = active; }
}
