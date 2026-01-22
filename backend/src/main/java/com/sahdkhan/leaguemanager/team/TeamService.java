package com.sahdkhan.leaguemanager.team;

import com.sahdkhan.leaguemanager.league.League;
import com.sahdkhan.leaguemanager.league.LeagueRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

/**
 * Service class for managing teams and players within leagues.
 */
@Service
public class TeamService {

    private final TeamRepository teams;
    private final PlayerRepository players;
    private final LeagueRepository leagues;

    /**
     * Constructs a TeamService with the given repositories.
     *
     * @param teams   the team repository
     * @param players the player repository
     * @param leagues the league repository
     */
    public TeamService(
            TeamRepository teams,
            PlayerRepository players,
            LeagueRepository leagues
    ) {
        this.teams = teams;
        this.players = players;
        this.leagues = leagues;
    }

    /**
     * Creates a new team within the specified league.
     *
     * @param leagueId the ID of the league
     * @param name     the name of the team
     * @return the created team
     */
    public Team createTeam(UUID leagueId, String name) {
        League league = leagues.findById(leagueId).orElseThrow();
        return teams.save(new Team(name, league));
    }

    /**
     * Retrieves all teams within the specified league.
     *
     * @param leagueId the ID of the league
     * @return the list of teams in the league
     */
    public List<Team> getTeams(UUID leagueId) {
        League league = leagues.findById(leagueId).orElseThrow();
        return teams.findByLeague(league);
    }

    /**
     * Adds a new player to the specified team.
     *
     * @param teamId the ID of the team
     * @param name   the name of the player
     * @return the added player
     */
    public Player addPlayer(UUID teamId, String name) {
        Team team = teams.findById(teamId).orElseThrow();
        return players.save(new Player(name, team));
    }

    /**
     * Retrieves all players within the specified team.
     *
     * @param teamId the ID of the team
     * @return the list of players in the team
     */
    public List<Player> getPlayers(UUID teamId) {
        Team team = teams.findById(teamId).orElseThrow();
        return players.findByTeam(team);
    }

    /**
     * Deletes a player from a team using the ID of the team and the players ID.
     *
     * @param playerId the ID of the player to delete
     */
    public void deletePlayer(UUID playerId) {
        Player player = players.findById(playerId).orElseThrow();
        players.delete( player );
    }

    /**
     * Deletes a team using the ID of the team.
     *
     * @param teamId the ID of the team to delete
     */
    public void deleteTeam(UUID teamId)
    {
        Team team = teams.findById( teamId ).orElseThrow();
        teams.delete( team );
    }
}
