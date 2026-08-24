package com.sahdkhan.leaguemanager.league;

import com.sahdkhan.leaguemanager.config.JwtAuthFilter.AuthPrincipal;
import com.sahdkhan.leaguemanager.sports.Sport;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
            @NotNull UUID sportId
    ) {}

    /**
     * Request body for updating a league.
     * The fields are optional; only provided fields will be updated.
     * @param name the new name of the league
     * @param sportId the new sport id for the league
     */
    public record UpdateLeagueRequest( String name, UUID sportId ) {}
    public record SportResponse( UUID id, String name ) {}
    public record LeagueResponse( UUID id, String name, SportResponse sport, LeagueRole role) {}

    private LeagueResponse toResponse(League league, LeagueRole role) {
        Sport sport = league.getSport();
        SportResponse sportResponse = sport == null ? null : new SportResponse(sport.getId(), sport.getName());
        return new LeagueResponse(league.getId(), league.getName(), sportResponse, role);
    }

    @PostMapping
    public LeagueResponse create(
            @AuthenticationPrincipal AuthPrincipal principal,
            @Valid @RequestBody CreateLeagueRequest req
    ) {
        League league = leagues.createLeague(
                principal.userId(),
                req.name(),
                req.sportId()
        );
        return toResponse(league, LeagueRole.OWNER);
    }

    @PutMapping("/{leagueId}")
    public LeagueResponse update(
            @RequestBody UpdateLeagueRequest req,
            @PathVariable UUID leagueId,
            @AuthenticationPrincipal AuthPrincipal principal
    )
    {
        League league = leagues.updateLeague( leagueId, req.name(), req.sportId(), principal.userId());
        LeagueRole role = leagues.getRole( leagueId, principal.userId() );
        return toResponse(league, role);
    }

    @GetMapping("/mine")
    public List<LeagueResponse> mine(
            @AuthenticationPrincipal AuthPrincipal principal
    ) {
        return leagues.myLeagues(principal.userId())
                .stream()
                .map(m -> toResponse(m.getLeague(), m.getRole()))
                .toList();
    }

    @DeleteMapping("/{leagueId}")
    public LeagueResponse delete(
            @PathVariable UUID leagueId,
            @AuthenticationPrincipal AuthPrincipal principal
    )
    {
        LeagueRole role = leagues.getRole( leagueId, principal.userId() );
        League league = leagues.deleteLeague( leagueId, principal.userId() );
        return toResponse(league, role);
    }


}
