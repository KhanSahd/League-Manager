package com.sahdkhan.leaguemanager.league;

import com.sahdkhan.leaguemanager.team.Team;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

/**
 * A shareable code that lets someone join a league with a specific role,
 * without needing a public league directory.
 */
@Entity
public class LeagueInvite {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "league_id", nullable = false)
    private League league;

    @Column(nullable = false, unique = true)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LeagueRole role;

    @Column(name = "expires_at")
    private Instant expiresAt;

    @Column(name = "max_uses")
    private Integer maxUses;

    @Column(nullable = false)
    private int uses;

    /** For TEAM_MANAGER invites: the team the resulting membership is scoped to. */
    @ManyToOne(optional = true)
    @JoinColumn(name = "team_id", nullable = true)
    private Team team;

    protected LeagueInvite() {}

    public LeagueInvite(League league, String code, LeagueRole role, Instant expiresAt, Integer maxUses, Team team) {
        this.league = league;
        this.code = code;
        this.role = role;
        this.expiresAt = expiresAt;
        this.maxUses = maxUses;
        this.uses = 0;
        this.team = team;
    }

    public UUID getId() { return id; }
    public League getLeague() { return league; }
    public String getCode() { return code; }
    public LeagueRole getRole() { return role; }
    public Instant getExpiresAt() { return expiresAt; }
    public Integer getMaxUses() { return maxUses; }
    public int getUses() { return uses; }
    public Team getTeam() { return team; }

    public boolean isExpired() {
        return expiresAt != null && Instant.now().isAfter(expiresAt);
    }

    public boolean isExhausted() {
        return maxUses != null && uses >= maxUses;
    }

    public void recordUse() {
        this.uses++;
    }
}
