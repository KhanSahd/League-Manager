package com.sahdkhan.leaguemanager.league;

import com.sahdkhan.leaguemanager.config.JwtAuthFilter.AuthPrincipal;
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

    record CreateLeagueRequest(String name, String sport) {}
    record LeagueResponse(UUID id, String name, String sport, LeagueRole role) {}

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
