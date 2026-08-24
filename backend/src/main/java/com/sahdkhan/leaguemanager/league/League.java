package com.sahdkhan.leaguemanager.league;

import com.sahdkhan.leaguemanager.sports.Sport;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Represents a sports league with a unique identifier, name, and sport type.
 */
@Entity
public class League {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String name;

    @ManyToOne(optional = false)
    @JoinColumn(name = "sport_id", nullable = false)
    private Sport sport;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(name = "primary_color")
    private String primaryColor;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false)
    private Map<String, Object> settings = new HashMap<>();

    protected League() {}

    public League(String name, Sport sport, String slug) {
        this.name = name;
        this.sport = sport;
        this.slug = slug;
    }

    public UUID getId() { return id; }
    public String getName() { return name; }
    public Sport getSport() { return sport; }
    public String getSlug() { return slug; }
    public String getLogoUrl() { return logoUrl; }
    public String getPrimaryColor() { return primaryColor; }
    public Map<String, Object> getSettings() { return settings; }

    public void setName( String name) { this.name = name; }
    public void setSport( Sport sport) { this.sport = sport; }
    public void setLogoUrl( String logoUrl ) { this.logoUrl = logoUrl; }
    public void setPrimaryColor( String primaryColor ) { this.primaryColor = primaryColor; }
    public void setSettings( Map<String, Object> settings ) { this.settings = settings; }
}
