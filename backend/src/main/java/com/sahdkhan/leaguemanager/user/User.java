package com.sahdkhan.leaguemanager.user;

import jakarta.persistence.*;
import java.util.UUID;

/**
 * Represents a user in the league management system.
 * Each user has a unique email and a hashed password for authentication.
 */
@Entity
@Table( name = "users", uniqueConstraints = @UniqueConstraint( columnNames = "email" ) )
public class User
{

    @Id
    @GeneratedValue
    private UUID id;

    @Column( nullable = false )
    private String email;

    @Column()
    private String firstName;

    @Column()
    private String lastName;

    @Column( nullable = false )
    private String passwordHash;

    protected User()
    {
    }

    /**
     * Creates a new User with the specified email and password hash.
     *
     * @param email the user's email address
     * @param passwordHash the hashed password for the user
     */
    public User( String firstName,
                 String lastName,
                 String email,
                 String passwordHash )
    {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.passwordHash = passwordHash;
    }

    public UUID getId()
    {
        return id;
    }

    public String getFullName()
    {
        return String.format( "%s %s", firstName, lastName );
    }

    public String getFirstName()
    {
        return firstName;
    }

    public String getLastName()
    {
        return lastName;
    }

    public String getEmail()
    {
        return email;
    }

    public String getPasswordHash()
    {
        return passwordHash;
    }

    public void setPasswordHash( String passwordHash )
    {
        this.passwordHash = passwordHash;
    }
}
