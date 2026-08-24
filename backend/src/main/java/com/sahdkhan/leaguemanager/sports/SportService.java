package com.sahdkhan.leaguemanager.sports;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class SportService
{
    private final SportRepository sports;

    public SportService(SportRepository sports)
    {
        this.sports = sports;
    }

    public List<Sport> getAllSports()
    {
        return sports.findAll();
    }

    public Sport getSportByName(String name)
    {
        return sports.findByName(name).orElseThrow();
    }

    public Sport getSportById( UUID id)
    {
        return sports.findById(id).orElseThrow();
    }
}
