package com.sahdkhan.leaguemanager.league;

import com.sahdkhan.leaguemanager.exceptions.ForbiddenException;
import com.sahdkhan.leaguemanager.sports.Sport;
import com.sahdkhan.leaguemanager.sports.SportRepository;
import com.sahdkhan.leaguemanager.team.Player;
import com.sahdkhan.leaguemanager.team.PlayerRepository;
import com.sahdkhan.leaguemanager.team.Team;
import com.sahdkhan.leaguemanager.team.TeamRepository;
import com.sahdkhan.leaguemanager.user.User;
import com.sahdkhan.leaguemanager.user.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.UUID;

/**
 * Service class for managing leagues and league members.
 */
@Service
public class LeagueService
{
    /** Roles that may create, update, or delete resources within a league. */
    private static final Set<LeagueRole> ADMIN_ROLES = Set.of(LeagueRole.OWNER, LeagueRole.ADMIN);

    private final LeagueRepository leagues;
    private final LeagueMemberRepository members;
    private final UserRepository users;
    private final SportRepository sports;
    private final TeamRepository teams;
    private final PlayerRepository players;

    /**
     * Constructs a LeagueService with the given repositories.
     *
     * @param leagues the league repository
     * @param members the league member repository
     * @param users   the user repository
     */
    public LeagueService(
            LeagueRepository leagues,
            LeagueMemberRepository members,
            UserRepository users,
            SportRepository sports,
            TeamRepository teams,
            PlayerRepository players
    )
    {
        this.leagues = leagues;
        this.members = members;
        this.users = users;
        this.sports = sports;
        this.teams = teams;
        this.players = players;
    }

    /**
     * Ensures that the user is a member of the specified league.
     * @param league the league
     * @param user the user
     * @return the league member
     */
    private LeagueMember requireMembership(League league, User user)
    {
        return members.findByLeagueAndUser(league, user)
                .orElseThrow(() -> new ForbiddenException("Not a member of this league"));
    }

    /**
     * Ensures that the user has admin privileges in the specified league.
     * @param league the league
     * @param user the user
     * @return the caller's league membership
     */
    private LeagueMember requireAdmin(League league, User user)
    {
        LeagueMember m = requireMembership(league, user);
        if (!ADMIN_ROLES.contains(m.getRole()))
        {
            throw new ForbiddenException("Insufficient privileges");
        }
        return m;
    }

    /**
     * Retrieves the caller's role within the specified league.
     * @param leagueId the ID of the league
     * @param userId the ID of the user
     * @return the caller's role in the league
     */
    public LeagueRole getRole( UUID leagueId, UUID userId )
    {
        League league = leagues.findById( leagueId ).orElseThrow();
        User user = users.findById( userId ).orElseThrow();
        return requireMembership( league, user ).getRole();
    }

    /**
     * Creates a new league with the specified name and sport, and assigns the user as the owner.
     *
     * @param userId the ID of the user creating the league
     * @param name   the name of the league
     * @param sportId  the sport of the league
     * @return the created league
     */
    public League createLeague( UUID userId, String name, UUID sportId )
    {
        User owner = users.findById( userId ).orElseThrow();
        Sport sport = sports.findById( sportId ).orElseThrow();
        League league = leagues.save( new League( name, sport ) );
        members.save( new LeagueMember( owner, league, LeagueRole.OWNER ) );
        return league;
    }

    /**
     * Updates the details of an existing league. Only the fields provided are changed.
     *
     * @param leagueId the ID of the league to update
     * @param name     the new name of the league, or null to leave unchanged
     * @param sportId  the new sport of the league, or null to leave unchanged
     * @return the updated league
     */
    public League updateLeague( UUID leagueId, String name, UUID sportId, UUID userId )
    {
        User user = users.findById( userId ).orElseThrow();
        League league = leagues.findById( leagueId ).orElseThrow();
        requireAdmin( league, user );
        if ( name != null && !name.isBlank() )
        {
            league.setName( name );
        }
        if ( sportId != null )
        {
            Sport sport = sports.findById( sportId ).orElseThrow();
            league.setSport( sport );
        }
        return leagues.save( league );
    }

    @Transactional
    public League deleteLeague( UUID leagueId, UUID userId )
    {
        User user = users.findById( userId ).orElseThrow();
        League league = leagues.findById( leagueId ).orElseThrow();
        requireAdmin( league, user );

        List<Team> leagueTeams = teams.findByLeague( league );
        for ( Team team : leagueTeams )
        {
            List<Player> teamPlayers = players.findByTeam( team );
            players.deleteAll( teamPlayers );
        }
        teams.deleteAll( leagueTeams );
        members.deleteByLeague( league );
        leagues.delete( league );
        return league;
    }

    /**
     * Retrieves the leagues associated with the specified user.
     * @param userId the ID of the user
     * @return a list of league members associated with the user
     */
    public List< LeagueMember > myLeagues( UUID userId )
    {
        User user = users.findById( userId ).orElseThrow();
        return members.findByUser( user );
    }

    /**
     * Retrieves a league by its ID.
     * @param leagueId the ID of the league
     * @return the league with the specified ID
     */
    public League getLeagueById( UUID leagueId )
    {
        return leagues.findById( leagueId ).orElseThrow();
    }
}
