package com.sahdkhan.leaguemanager.team;

import com.sahdkhan.leaguemanager.season.Season;
import jakarta.persistence.*;

import java.util.UUID;

/**
 * Places a {@link Player} on a {@link Team} for a specific {@link Season}.
 * This is the join that lets a player's roster history follow them across
 * seasons and teams rather than being pinned to one team forever.
 */
@Entity
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"season_id", "team_id", "player_id"})
})
public class RosterEntry {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "season_id", nullable = false)
    private Season season;

    @ManyToOne(optional = false)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @ManyToOne(optional = false)
    @JoinColumn(name = "player_id", nullable = false)
    private Player player;

    @Column(name = "jersey_number")
    private Integer jerseyNumber;

    private String position;

    protected RosterEntry() {}

    public RosterEntry(Season season, Team team, Player player, Integer jerseyNumber, String position) {
        this.season = season;
        this.team = team;
        this.player = player;
        this.jerseyNumber = jerseyNumber;
        this.position = position;
    }

    public UUID getId() { return id; }
    public Season getSeason() { return season; }
    public Team getTeam() { return team; }
    public Player getPlayer() { return player; }
    public Integer getJerseyNumber() { return jerseyNumber; }
    public String getPosition() { return position; }

    public void setJerseyNumber(Integer jerseyNumber) { this.jerseyNumber = jerseyNumber; }
    public void setPosition(String position) { this.position = position; }
}
