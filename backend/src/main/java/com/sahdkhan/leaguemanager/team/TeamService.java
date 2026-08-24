package com.sahdkhan.leaguemanager.team;

import com.sahdkhan.leaguemanager.exceptions.ForbiddenException;
import com.sahdkhan.leaguemanager.league.*;
import com.sahdkhan.leaguemanager.user.User;
import com.sahdkhan.leaguemanager.user.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.UUID;

/**
 * Service class for managing teams and players within leagues.
 */
@Service
public class TeamService {

    /** Roles that may create, update, or delete resources within a league. */
    private static final Set<LeagueRole> ADMIN_ROLES = Set.of(LeagueRole.OWNER, LeagueRole.ADMIN);

    private final TeamRepository teams;
    private final PlayerRepository players;
    private final LeagueRepository leagues;
    private final LeagueMemberRepository leagueMembers;
    private final UserRepository users;

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
            LeagueMemberRepository leagueMembers,
            UserRepository users
    ) {
        this.teams = teams;
        this.players = players;
        this.leagues = leagues;
        this.leagueMembers = leagueMembers;
        this.users = users;
    }

    private LeagueMember requireMembership(League league, User user) {
        return leagueMembers.findByLeagueAndUser(league, user)
                .orElseThrow(() -> new ForbiddenException("Not a member of this league"));
    }

    private void requireAdmin(League league, User user) {
        LeagueMember m = requireMembership(league, user);
        if (!ADMIN_ROLES.contains(m.getRole())) {
            throw new ForbiddenException("Insufficient privileges");
        }
    }

    private User getUser( UUID userId ) {
        return users.findById( userId ).orElseThrow();
    }


    /**
     * Creates a new team within the specified league.
     *
     * @param leagueId the ID of the league
     * @param name     the name of the team
     * @return the created team
     */
    public Team createTeam( UUID leagueId, String name, UUID userId ) {
        League league = leagues.findById(leagueId).orElseThrow();
        User user = users.findById( userId ).orElseThrow();
        requireAdmin( league, user );
        return teams.save(new Team(name, league));
    }

    /**
     * Retrieves all teams within the specified league.
     *
     * @param leagueId the ID of the league
     * @return the list of teams in the league
     */
    public List<Team> getTeams(UUID leagueId, UUID userId) {
        League league = leagues.findById(leagueId).orElseThrow();
        requireMembership( league, getUser( userId ) );
        return teams.findByLeague(league);
    }

    /**
     * Adds a new player to the specified team.
     *
     * @param teamId the ID of the team
     * @param name   the name of the player
     * @return the added player
     */
    public Player addPlayer(UUID teamId, String name, UUID userId) {
        Team team = teams.findById(teamId).orElseThrow();
        requireAdmin( team.getLeague(), getUser( userId ) );
        return players.save(new Player(name, team));
    }

    /**
     * Retrieves all players within the specified team.
     *
     * @param teamId the ID of the team
     * @return the list of players in the team
     */
    public List<Player> getPlayers(UUID teamId, UUID userId) {
        Team team = teams.findById(teamId).orElseThrow();
        requireMembership( team.getLeague(), getUser( userId ) );
        return players.findByTeam(team);
    }

    /**
     * Deletes a player from the specified team.
     * @param teamId the ID of the team
     * @param playerId the ID of the player to be deleted
     */
    public void deletePlayer(UUID teamId, UUID playerId, UUID userId) {
        Team team = teams.findById( teamId ).orElseThrow();
        Player player = players.findById(playerId).orElseThrow();
        requireAdmin( team.getLeague(), getUser(userId) );
        if (!player.getTeam().getId().equals( team.getId() ))
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
    public void deleteTeam(UUID teamId, UUID userId)
    {
        Team team = teams.findById( teamId ).orElseThrow();
        requireAdmin( team.getLeague(), getUser(userId) );
        teams.delete( team );
    }
}
