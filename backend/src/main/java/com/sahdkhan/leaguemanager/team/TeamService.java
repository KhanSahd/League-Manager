package com.sahdkhan.leaguemanager.team;

import com.sahdkhan.leaguemanager.league.League;
import com.sahdkhan.leaguemanager.league.LeagueRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class TeamService {

    private final TeamRepository teams;
    private final PlayerRepository players;
    private final LeagueRepository leagues;

    public TeamService(
            TeamRepository teams,
            PlayerRepository players,
            LeagueRepository leagues
    ) {
        this.teams = teams;
        this.players = players;
        this.leagues = leagues;
    }

    public Team createTeam(UUID leagueId, String name) {
        League league = leagues.findById(leagueId).orElseThrow();
        return teams.save(new Team(name, league));
    }

    public List<Team> getTeams(UUID leagueId) {
        League league = leagues.findById(leagueId).orElseThrow();
        return teams.findByLeague(league);
    }

    public Player addPlayer(UUID teamId, String name) {
        Team team = teams.findById(teamId).orElseThrow();
        return players.save(new Player(name, team));
    }

    public List<Player> getPlayers(UUID teamId) {
        Team team = teams.findById(teamId).orElseThrow();
        return players.findByTeam(team);
    }
}
