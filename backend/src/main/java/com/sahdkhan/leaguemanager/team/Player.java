package com.sahdkhan.leaguemanager.team;

import com.sahdkhan.leaguemanager.league.League;
import com.sahdkhan.leaguemanager.user.User;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.UUID;

/**
 * A person tracked within a league. Scoped to the league rather than a single
 * team so a player's stats and roster history can follow them across seasons
 * and teams. {@link RosterEntry} is what actually places a player on a team.
 */
@Entity
public class Player {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "league_id", nullable = false)
    private League league;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    /** Links this player to a registered user, if they have an account. */
    @ManyToOne(optional = true)
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

    @Column(name = "photo_url")
    private String photoUrl;

    private LocalDate birthdate;

    protected Player() {}

    public Player(League league, String firstName, String lastName) {
        this.league = league;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public UUID getId() { return id; }
    public League getLeague() { return league; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getFullName() { return String.format("%s %s", firstName, lastName); }
    public User getUser() { return user; }
    public String getPhotoUrl() { return photoUrl; }
    public LocalDate getBirthdate() { return birthdate; }

    public void setFirstName(String firstName) { this.firstName = firstName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public void setUser(User user) { this.user = user; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }
    public void setBirthdate(LocalDate birthdate) { this.birthdate = birthdate; }
}
