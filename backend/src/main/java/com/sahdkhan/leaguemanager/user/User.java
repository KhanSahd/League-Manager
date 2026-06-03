package com.sahdkhan.leaguemanager.user;

import jakarta.persistence.*;
import java.util.UUID;

/**
 * Represents a user in the league management system.
 * Each user has a unique email and a hashed password for authentication.
 */
@Entity
@Table(name = "users", uniqueConstraints = @UniqueConstraint(columnNames = "email"))
public class User {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false)
    private String passwordHash;

    protected User() {}

    /**
     * Creates a new User with the specified email and password hash.
     * @param email the user's email address
     * @param passwordHash the hashed password for the user
     */
    public User(String email, String passwordHash) {
        this.email = email;
        this.passwordHash = passwordHash;
    }

    public UUID getId() { return id; }
    public String getEmail() { return email; }
    public String getPasswordHash() { return passwordHash; }
}
