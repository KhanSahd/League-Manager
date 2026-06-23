package com.sahdkhan.leaguemanager.league;

import com.sahdkhan.leaguemanager.config.JwtAuthFilter.AuthPrincipal;
import jakarta.validation.constraints.NotBlank;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/leagues")
public class LeagueController {

    private final LeagueService leagues;

    public LeagueController(LeagueService leagues) {
        this.leagues = leagues;
    }

    /**
     * Request body for creating a league.
     * The fields are required.
     * @param name the name of the league
     * @param sport the sport of the league
     */
    public record CreateLeagueRequest(
            @NotBlank String name,
            @NotBlank String sport
    ) {}

    /**
     * Request body for updating a league.
     * The fields are optional; only provided fields will be updated.
     * @param name the new name of the league
     * @param sport the new sport of the league
     */
    public record UpdateLeagueRequest( String name, String sport ) {}
    public record LeagueResponse(UUID id, String name, String sport, LeagueRole role) {}

    @PostMapping
    public LeagueResponse create(
            @AuthenticationPrincipal AuthPrincipal principal,
            @RequestBody CreateLeagueRequest req
    ) {
        League league = leagues.createLeague(
                principal.userId(),
                req.name(),
                req.sport()
        );
        return new LeagueResponse(
                league.getId(),
                league.getName(),
                league.getSport(),
                LeagueRole.OWNER
        );
    }

    @PutMapping("/{leagueId}")
    public LeagueResponse update(
            @RequestBody UpdateLeagueRequest req,
            @PathVariable UUID leagueId,
            @AuthenticationPrincipal AuthPrincipal principal
    )
    {
        leagues.updateLeague( leagueId, req.name(), req.sport(), principal.userId());
        League league = leagues.getLeagueById( leagueId );
        return new LeagueResponse(
                league.getId(),
                league.getName(),
                league.getSport(),
                LeagueRole.OWNER
        );
    }

    @GetMapping("/mine")
    public List<LeagueResponse> mine(
            @AuthenticationPrincipal AuthPrincipal principal
    ) {
        return leagues.myLeagues(principal.userId())
                .stream()
                .map(m -> new LeagueResponse(
                        m.getLeague().getId(),
                        m.getLeague().getName(),
                        m.getLeague().getSport(),
                        m.getRole()
                ))
                .toList();
    }

}
