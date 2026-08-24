package com.sahdkhan.leaguemanager.team;

import com.sahdkhan.leaguemanager.league.League;
import com.sahdkhan.leaguemanager.league.LeagueAccessService;
import com.sahdkhan.leaguemanager.league.LeagueRepository;
import com.sahdkhan.leaguemanager.season.Season;
import com.sahdkhan.leaguemanager.season.SeasonRepository;
import com.sahdkhan.leaguemanager.user.User;
import com.sahdkhan.leaguemanager.user.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

/**
 * Service class for managing teams and their rosters within leagues.
 */
@Service
public class TeamService {

    private final TeamRepository teams;
    private final PlayerRepository players;
    private final RosterEntryRepository rosterEntries;
    private final LeagueRepository leagues;
    private final SeasonRepository seasons;
    private final UserRepository users;
    private final LeagueAccessService access;

    public TeamService(
            TeamRepository teams,
            PlayerRepository players,
            RosterEntryRepository rosterEntries,
            LeagueRepository leagues,
            SeasonRepository seasons,
            UserRepository users,
            LeagueAccessService access
    ) {
        this.teams = teams;
        this.players = players;
        this.rosterEntries = rosterEntries;
        this.leagues = leagues;
        this.seasons = seasons;
        this.users = users;
        this.access = access;
    }

    private User getUser( UUID userId ) {
        return users.findById( userId ).orElseThrow();
    }

    private Season activeSeason( League league ) {
        return seasons.findByLeagueAndActiveTrue( league ).orElseThrow();
    }

    /**
     * Creates a new team within the specified league.
     */
    public Team createTeam( UUID leagueId, String name, UUID userId ) {
        League league = leagues.findById(leagueId).orElseThrow();
        access.requireAdmin( league, getUser( userId ) );
        return teams.save(new Team(name, league));
    }

    /**
     * Retrieves all teams within the specified league.
     */
    public List<Team> getTeams(UUID leagueId, UUID userId) {
        League league = leagues.findById(leagueId).orElseThrow();
        access.requireMembership( league, getUser( userId ) );
        return teams.findByLeague(league);
    }

    /**
     * Adds a new player to the league and places them on the team's roster
     * for the league's active season, in one step.
     */
    @Transactional
    public RosterEntry addPlayer(
            UUID teamId, String firstName, String lastName,
            Integer jerseyNumber, String position, UUID userId
    ) {
        Team team = teams.findById(teamId).orElseThrow();
        access.requireTeamManageAccess( team.getLeague(), getUser( userId ), team );
        Player player = players.save( new Player( team.getLeague(), firstName, lastName ) );
        Season season = activeSeason( team.getLeague() );
        return rosterEntries.save( new RosterEntry( season, team, player, jerseyNumber, position ) );
    }

    /**
     * Retrieves the team's roster for the league's active season.
     */
    public List<RosterEntry> getRoster(UUID teamId, UUID userId) {
        Team team = teams.findById(teamId).orElseThrow();
        access.requireMembership( team.getLeague(), getUser( userId ) );
        Season season = activeSeason( team.getLeague() );
        return rosterEntries.findBySeasonAndTeam( season, team );
    }

    /**
     * Removes a player from the team's roster for the league's active season.
     * The player themselves is not deleted, only this team/season placement.
     */
    public void removePlayer(UUID teamId, UUID playerId, UUID userId) {
        Team team = teams.findById( teamId ).orElseThrow();
        access.requireTeamManageAccess( team.getLeague(), getUser(userId), team );
        Season season = activeSeason( team.getLeague() );
        Player player = players.findById( playerId ).orElseThrow();
        RosterEntry entry = rosterEntries.findBySeasonAndTeamAndPlayer( season, team, player ).orElseThrow();
        rosterEntries.delete( entry );
    }

    /**
     * Deletes a team and every roster entry that places a player on it.
     */
    @Transactional
    public void deleteTeam(UUID teamId, UUID userId)
    {
        Team team = teams.findById( teamId ).orElseThrow();
        access.requireAdmin( team.getLeague(), getUser(userId) );
        rosterEntries.deleteAll( rosterEntries.findByTeam( team ) );
        teams.delete( team );
    }
}
