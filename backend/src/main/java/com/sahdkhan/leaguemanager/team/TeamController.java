package com.sahdkhan.leaguemanager.team;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.sahdkhan.leaguemanager.config.JwtAuthFilter.AuthPrincipal;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

    private final TeamService teams;

    public TeamController(TeamService teams) {
        this.teams = teams;
    }

    record CreateTeamRequest(@NotBlank String name) {}
    record TeamResponse(UUID id, String name) {}
    record CreatePlayerRequest(@NotBlank String name) {}
    record PlayerResponse(UUID id, String name) {}

    @PostMapping("/league/{leagueId}")
    public TeamResponse createTeam(
            @PathVariable UUID leagueId,
            @Valid @RequestBody CreateTeamRequest req,
            @AuthenticationPrincipal AuthPrincipal principal
    ) {
        Team team = teams.createTeam(leagueId, req.name(), principal.userId() );
        return new TeamResponse(team.getId(), team.getName());
    }

    @GetMapping("/league/{leagueId}")
    public List<TeamResponse> teams(
            @PathVariable UUID leagueId,
            @AuthenticationPrincipal AuthPrincipal principal
    ) {
        return teams.getTeams(leagueId, principal.userId())
                .stream()
                .map(t -> new TeamResponse(t.getId(), t.getName()))
                .toList();
    }

    @PostMapping("/{teamId}/players")
    public PlayerResponse addPlayer(
            @PathVariable UUID teamId,
            @Valid @RequestBody CreatePlayerRequest req,
            @AuthenticationPrincipal AuthPrincipal principal
    ) {
        Player p = teams.addPlayer(teamId, req.name(), principal.userId());
        return new PlayerResponse(p.getId(), p.getName());
    }

    @GetMapping("/{teamId}/players")
    public List<PlayerResponse> players(
            @PathVariable UUID teamId,
            @AuthenticationPrincipal AuthPrincipal principal
    ) {
        return teams.getPlayers(teamId, principal.userId())
                .stream()
                .map(p -> new PlayerResponse(p.getId(), p.getName()))
                .toList();
    }

    /**
     * Remove a player from a team.
     * @param teamId - the ID of the team
     * @param playerId - the ID of the player to be removed
     */
    @DeleteMapping("/{teamId}/players/{playerId}")
    public void removePlayer(
            @PathVariable UUID teamId,
            @PathVariable UUID playerId,
            @AuthenticationPrincipal AuthPrincipal principal
    )
    {
        teams.deletePlayer(teamId, playerId, principal.userId());
    }

    /**
     * Remove a team.
     * @param teamId - the ID of the team to be removed
     */
    @DeleteMapping("/{teamId}")
    public void removeTeam(
            @PathVariable UUID teamId,
            @AuthenticationPrincipal AuthPrincipal principal
    )
    {
        teams.deleteTeam(teamId, principal.userId());
    }
}
