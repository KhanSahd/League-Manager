package com.sahdkhan.leaguemanager.league;

import com.sahdkhan.leaguemanager.exceptions.ForbiddenException;
import com.sahdkhan.leaguemanager.sports.Sport;
import com.sahdkhan.leaguemanager.sports.SportRepository;
import com.sahdkhan.leaguemanager.user.User;
import com.sahdkhan.leaguemanager.user.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

/**
 * Service class for managing leagues and league members.
 */
@Service
public class LeagueService
{

    private final LeagueRepository leagues;
    private final LeagueMemberRepository members;
    private final UserRepository users;
    private final SportRepository sports;

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
            SportRepository sports
    )
    {
        this.leagues = leagues;
        this.members = members;
        this.users = users;
        this.sports = sports;
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
     */
    private void requireAdmin(League league, User user)
    {
        LeagueMember m = requireMembership(league, user);
        if (m.getRole() == LeagueRole.MEMBER)
        {
            throw new ForbiddenException("Insufficient privileges");
        }
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
     * Updates the details of an existing league.
     *
     * @param leagueId the ID of the league to update
     * @param name     the new name of the league
     * @param sportId    the new sport of the league
     * @return the updated league
     */
    public League updateLeague( UUID leagueId, String name, UUID sportId, UUID userId )
    {
        User user = users.findById( userId ).orElseThrow();
        League league = leagues.findById( leagueId ).orElseThrow();
        Sport sport = sports.findById( sportId ).orElseThrow();
        requireAdmin( league, user );
        league.setName( name );
        league.setSport( sport );
        return leagues.save( league );
    }

    @Transactional
    public League deleteLeague( UUID leagueId, UUID userId )
    {
        User user = users.findById( userId ).orElseThrow();
        League league = leagues.findById( leagueId ).orElseThrow();
        requireAdmin( league, user );
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
