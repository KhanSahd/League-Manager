package com.sahdkhan.leaguemanager.sports;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

import java.util.UUID;

@Entity
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
