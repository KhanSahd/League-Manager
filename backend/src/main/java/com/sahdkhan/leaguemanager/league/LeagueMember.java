package com.sahdkhan.leaguemanager.league;

import com.sahdkhan.leaguemanager.team.Team;
import com.sahdkhan.leaguemanager.user.User;
import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "league_id"})
})
public class LeagueMember {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "league_id", nullable = false)
    private League league;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LeagueRole role;

    /** Scopes a TEAM_MANAGER to a single team. Null for league-wide roles. */
    @ManyToOne(optional = true)
    @JoinColumn(name = "team_id", nullable = true)
    private Team team;

    protected LeagueMember() {}

    public LeagueMember(User user, League league, LeagueRole role) {
        this.user = user;
        this.league = league;
        this.role = role;
    }

    public LeagueMember(User user, League league, LeagueRole role, Team team) {
        this(user, league, role);
        this.team = team;
    }

    public UUID getId() { return id; }
    public User getUser() { return user; }
    public League getLeague() { return league; }
    public LeagueRole getRole() { return role; }
    public Team getTeam() { return team; }

    public void setRole(LeagueRole role) { this.role = role; }
    public void setTeam(Team team) { this.team = team; }
}
