package com.sahdkhan.leaguemanager.league;

import com.sahdkhan.leaguemanager.config.JwtAuthFilter.AuthPrincipal;
import com.sahdkhan.leaguemanager.sports.Sport;
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
     * @param sportId the id of sport for the league
     */
    public record CreateLeagueRequest(
            @NotBlank String name,
            @NotBlank UUID sportId
    ) {}

    /**
     * Request body for updating a league.
     * The fields are optional; only provided fields will be updated.
     * @param name the new name of the league
     * @param sportId the new sport id for the league
     */
    public record UpdateLeagueRequest( String name, UUID sportId ) {}
    public record LeagueResponse( UUID id, String name, Sport sport, LeagueRole role) {}

    @PostMapping
    public LeagueResponse create(
            @AuthenticationPrincipal AuthPrincipal principal,
            @RequestBody CreateLeagueRequest req
    ) {
        League league = leagues.createLeague(
                principal.userId(),
                req.name(),
                req.sportId()
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
        leagues.updateLeague( leagueId, req.name(), req.sportId(), principal.userId());
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
                        m.getLeague().getSport() != null ? m.getLeague().getSport() : null,
                        m.getRole()
                ))
                .toList();
    }

    @DeleteMapping("/{leagueId}")
    public LeagueResponse delete(
            @PathVariable UUID leagueId,
            @AuthenticationPrincipal AuthPrincipal principal
    )
    {
        League league = leagues.getLeagueById( leagueId );
        leagues.deleteLeague( leagueId, principal.userId() );
        return new LeagueResponse(
                league.getId(),
                league.getName(),
                league.getSport(),
                LeagueRole.OWNER
        );
    }


}
