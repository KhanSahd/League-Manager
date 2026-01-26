package com.sahdkhan.leaguemanager.team;

import com.sahdkhan.leaguemanager.exceptions.ForbiddenException;
import com.sahdkhan.leaguemanager.league.*;
import com.sahdkhan.leaguemanager.user.User;
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
    private final LeagueMemberRepository leagueMembers;

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
            LeagueRepository leagues,
            LeagueMemberRepository leagueMembers
    ) {
        this.teams = teams;
        this.players = players;
        this.leagues = leagues;
        this.leagueMembers = leagueMembers;
    }

    private LeagueMember requireMembership(League league, User user) {
        return leagueMembers.findByLeagueAndUser(league, user)
                .orElseThrow(() -> new ForbiddenException("Not a member of this league"));
    }

    private void requireAdmin(League league, User user) {
        LeagueMember m = requireMembership(league, user);
        if (m.getRole() == LeagueRole.MEMBER) {
            throw new ForbiddenException("Insufficient privileges");
        }
    }


    /**
     * Creates a new team within the specified league.
     *
     * @param leagueId the ID of the league
     * @param name     the name of the team
     * @return the created team
     */
    public Team createTeam( UUID leagueId, String name, User user ) {
        League league = leagues.findById(leagueId).orElseThrow();
        requireAdmin( league, user );
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
    public Player addPlayer(UUID teamId, String name, User user) {
        Team team = teams.findById(teamId).orElseThrow();
        requireAdmin( team.getLeague(), user );
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
     * Deletes a player from the specified team.
     * @param teamId the ID of the team
     * @param playerId the ID of the player to be deleted
     */
    public void deletePlayer(UUID teamId, UUID playerId, User user) {
        Team team = teams.findById( teamId ).orElseThrow();
        Player player = players.findById(playerId).orElseThrow();
        requireAdmin( team.getLeague(), user );
        if (!player.getTeam().equals( team ))
        {
            throw new IllegalArgumentException( "Player does not belong to the specified team" );
        }
        players.delete( player );
    }

    /**
     * Deletes a team using the ID of the team.
     *
     * @param teamId the ID of the team to delete
     */
    public void deleteTeam(UUID teamId, User user)
    {
        Team team = teams.findById( teamId ).orElseThrow();
        requireAdmin( team.getLeague(), user );
        teams.delete( team );
    }
}
