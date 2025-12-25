package com.sahdkhan.leaguemanager.league;

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
    private User user;

    @ManyToOne(optional = false)
    private League league;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LeagueRole role;

    protected LeagueMember() {}

    public LeagueMember(User user, League league, LeagueRole role) {
        this.user = user;
        this.league = league;
        this.role = role;
    }

    public League getLeague() { return league; }
    public LeagueRole getRole() { return role; }
}
