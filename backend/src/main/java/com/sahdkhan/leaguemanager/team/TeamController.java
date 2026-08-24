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
    record CreatePlayerRequest(
            @NotBlank String firstName,
            @NotBlank String lastName,
            Integer jerseyNumber,
            String position
    ) {}
    record RosterEntryResponse(
            UUID playerId,
            String firstName,
            String lastName,
            Integer jerseyNumber,
            String position
    ) {}

    private RosterEntryResponse toResponse(RosterEntry entry) {
        return new RosterEntryResponse(
                entry.getPlayer().getId(),
                entry.getPlayer().getFirstName(),
                entry.getPlayer().getLastName(),
                entry.getJerseyNumber(),
                entry.getPosition()
        );
    }

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

    /**
     * Adds a new player to the league and places them on this team's roster
     * for the league's active season.
     */
    @PostMapping("/{teamId}/players")
    public RosterEntryResponse addPlayer(
            @PathVariable UUID teamId,
            @Valid @RequestBody CreatePlayerRequest req,
            @AuthenticationPrincipal AuthPrincipal principal
    ) {
        RosterEntry entry = teams.addPlayer(
                teamId, req.firstName(), req.lastName(), req.jerseyNumber(), req.position(), principal.userId()
        );
        return toResponse(entry);
    }

    /**
     * The team's roster for the league's active season.
     */
    @GetMapping("/{teamId}/players")
    public List<RosterEntryResponse> players(
            @PathVariable UUID teamId,
            @AuthenticationPrincipal AuthPrincipal principal
    ) {
        return teams.getRoster(teamId, principal.userId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Remove a player from a team's active-season roster. The player record
     * itself is not deleted.
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
        teams.removePlayer(teamId, playerId, principal.userId());
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
