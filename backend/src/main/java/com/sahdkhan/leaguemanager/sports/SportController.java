package com.sahdkhan.leaguemanager.sports;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/sports")
public class SportController
{
    private final SportService sports;

    public SportController(SportService sports)
    {
        this.sports = sports;
    }

    public record SportResponse( UUID id, String name ){}

    @GetMapping("/all")
    public List<SportResponse> getAllSports()
    {
        return sports.getAllSports().stream()
                .map(s -> new SportResponse(s.getId(), s.getName()))
                .toList();
    }
}
