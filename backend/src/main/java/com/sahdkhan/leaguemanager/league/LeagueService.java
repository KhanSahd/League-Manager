package com.sahdkhan.leaguemanager.league;

import com.sahdkhan.leaguemanager.season.Season;
import com.sahdkhan.leaguemanager.season.SeasonRepository;
import com.sahdkhan.leaguemanager.sports.Sport;
import com.sahdkhan.leaguemanager.sports.SportRepository;
import com.sahdkhan.leaguemanager.team.Player;
import com.sahdkhan.leaguemanager.team.PlayerRepository;
import com.sahdkhan.leaguemanager.team.RosterEntry;
import com.sahdkhan.leaguemanager.team.RosterEntryRepository;
import com.sahdkhan.leaguemanager.team.Team;
import com.sahdkhan.leaguemanager.team.TeamRepository;
import com.sahdkhan.leaguemanager.user.User;
import com.sahdkhan.leaguemanager.user.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.List;
import java.util.UUID;

/**
 * Service class for managing leagues and league members.
 */
@Service
public class LeagueService
{
    private static final SecureRandom RANDOM = new SecureRandom();

    private final LeagueRepository leagues;
    private final LeagueMemberRepository members;
    private final UserRepository users;
    private final SportRepository sports;
    private final TeamRepository teams;
    private final PlayerRepository players;
    private final SeasonRepository seasons;
    private final RosterEntryRepository rosterEntries;
    private final LeagueInviteRepository invites;
    private final LeagueAccessService access;

    public LeagueService(
            LeagueRepository leagues,
            LeagueMemberRepository members,
            UserRepository users,
            SportRepository sports,
            TeamRepository teams,
            PlayerRepository players,
            SeasonRepository seasons,
            RosterEntryRepository rosterEntries,
            LeagueInviteRepository invites,
            LeagueAccessService access
    )
    {
        this.leagues = leagues;
        this.members = members;
        this.users = users;
        this.sports = sports;
        this.teams = teams;
        this.players = players;
        this.seasons = seasons;
        this.rosterEntries = rosterEntries;
        this.invites = invites;
        this.access = access;
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
        return access.requireMembership( league, user ).getRole();
    }

    /**
     * Creates a new league with the specified name and sport, assigns the user as
     * the owner, and starts its first season.
     *
     * @param userId the ID of the user creating the league
     * @param name   the name of the league
     * @param sportId  the sport of the league
     * @return the created league
     */
    @Transactional
    public League createLeague( UUID userId, String name, UUID sportId )
    {
        User owner = users.findById( userId ).orElseThrow();
        Sport sport = sports.findById( sportId ).orElseThrow();
        League league = leagues.save( new League( name, sport, generateSlug( name ) ) );
        members.save( new LeagueMember( owner, league, LeagueRole.OWNER ) );
        seasons.save( new Season( league, "Season 1", null, null, true ) );
        return league;
    }

    private String generateSlug( String name )
    {
        String base = name.toLowerCase().replaceAll( "[^a-z0-9]+", "-" ).replaceAll( "(^-|-$)", "" );
        String suffix = Long.toHexString( RANDOM.nextLong() ).substring( 0, 8 );
        return ( base.isBlank() ? "league" : base ) + "-" + suffix;
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
        access.requireAdmin( league, user );
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
        access.requireAdmin( league, user );

        List<Team> leagueTeams = teams.findByLeague( league );
        for ( Team team : leagueTeams )
        {
            rosterEntries.deleteAll( rosterEntries.findByTeam( team ) );
        }
        players.deleteAll( players.findByLeague( league ) );
        teams.deleteAll( leagueTeams );
        seasons.deleteAll( seasons.findByLeagueOrderByStartsOnDesc( league ) );
        invites.deleteAll( invites.findByLeague( league ) );
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
