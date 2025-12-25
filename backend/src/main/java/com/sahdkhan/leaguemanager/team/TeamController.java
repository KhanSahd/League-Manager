package com.sahdkhan.leaguemanager.team;

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

    record CreateTeamRequest(String name) {}
    record TeamResponse(UUID id, String name) {}
    record CreatePlayerRequest(String name) {}
    record PlayerResponse(UUID id, String name) {}

    @PostMapping("/league/{leagueId}")
    public TeamResponse createTeam(
            @PathVariable UUID leagueId,
            @RequestBody CreateTeamRequest req
    ) {
        Team team = teams.createTeam(leagueId, req.name());
        return new TeamResponse(team.getId(), team.getName());
    }

    @GetMapping("/league/{leagueId}")
    public List<TeamResponse> teams(@PathVariable UUID leagueId) {
        return teams.getTeams(leagueId)
                .stream()
                .map(t -> new TeamResponse(t.getId(), t.getName()))
                .toList();
    }

    @PostMapping("/{teamId}/players")
    public PlayerResponse addPlayer(
            @PathVariable UUID teamId,
            @RequestBody CreatePlayerRequest req
    ) {
        Player p = teams.addPlayer(teamId, req.name());
        return new PlayerResponse(p.getId(), p.getName());
    }

    @GetMapping("/{teamId}/players")
    public List<PlayerResponse> players(@PathVariable UUID teamId) {
        return teams.getPlayers(teamId)
                .stream()
                .map(p -> new PlayerResponse(p.getId(), p.getName()))
                .toList();
    }
}
