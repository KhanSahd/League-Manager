package com.sahdkhan.leaguemanager.sports;

import com.sahdkhan.leaguemanager.config.JwtAuthFilter.AuthPrincipal;
import jakarta.validation.constraints.NotBlank;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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

    public record addSportRequest(@NotBlank  String name) {}
    public record SportResponse( UUID id, String name ){}

    @GetMapping("/all")
    public List<SportResponse> getAllSports()
    {
        return sports.getAllSports().stream()
                .map(s -> new SportResponse(s.getId(), s.getName()))
                .toList();
    }

    @PostMapping
    public SportResponse addSport(
            @RequestBody addSportRequest req )
    {
        Sport sport = sports.addSport(req.name());
        return new SportResponse(sport.getId(), sport.getName());
    }
}
