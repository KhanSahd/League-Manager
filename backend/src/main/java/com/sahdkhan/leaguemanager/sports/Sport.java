package com.sahdkhan.leaguemanager.sports;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "sport")
public class Sport
{
    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = true)
    private String name;

    protected Sport() {}

    public Sport(String name)
    {
        this.name = name;
    }

    public UUID getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
