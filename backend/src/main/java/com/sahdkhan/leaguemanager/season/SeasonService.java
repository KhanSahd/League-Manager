package com.sahdkhan.leaguemanager.season;

import com.sahdkhan.leaguemanager.league.League;
import com.sahdkhan.leaguemanager.league.LeagueAccessService;
import com.sahdkhan.leaguemanager.league.LeagueRepository;
import com.sahdkhan.leaguemanager.user.User;
import com.sahdkhan.leaguemanager.user.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class SeasonService {

    private final SeasonRepository seasons;
    private final LeagueRepository leagues;
    private final UserRepository users;
    private final LeagueAccessService access;

    public SeasonService(
            SeasonRepository seasons,
            LeagueRepository leagues,
            UserRepository users,
            LeagueAccessService access
    ) {
        this.seasons = seasons;
        this.leagues = leagues;
        this.users = users;
        this.access = access;
    }

    public List<Season> getSeasons( UUID leagueId, UUID userId ) {
        League league = leagues.findById( leagueId ).orElseThrow();
        access.requireMembership( league, users.findById( userId ).orElseThrow() );
        return seasons.findByLeagueOrderByStartsOnDesc( league );
    }

    public Season getActiveSeason( UUID leagueId, UUID userId ) {
        League league = leagues.findById( leagueId ).orElseThrow();
        access.requireMembership( league, users.findById( userId ).orElseThrow() );
        return seasons.findByLeagueAndActiveTrue( league ).orElseThrow();
    }

    @Transactional
    public Season createSeason(
            UUID leagueId, String name, LocalDate startsOn, LocalDate endsOn, boolean activate, UUID userId
    ) {
        League league = leagues.findById( leagueId ).orElseThrow();
        access.requireAdmin( league, users.findById( userId ).orElseThrow() );

        if ( activate ) {
            deactivateCurrent( league );
        }
        return seasons.save( new Season( league, name, startsOn, endsOn, activate ) );
    }

    @Transactional
    public Season activateSeason( UUID seasonId, UUID userId ) {
        Season season = seasons.findById( seasonId ).orElseThrow();
        League league = season.getLeague();
        access.requireAdmin( league, users.findById( userId ).orElseThrow() );

        deactivateCurrent( league );
        season.setActive( true );
        return seasons.save( season );
    }

    /**
     * Flushes the deactivation immediately. Hibernate flushes pending inserts
     * before updates, so without this, activating a new season would insert
     * or update a second active=true row before this row's update to false
     * lands — tripping the "one active season per league" partial index.
     */
    private void deactivateCurrent( League league ) {
        seasons.findByLeagueAndActiveTrue( league ).ifPresent( current -> {
            current.setActive( false );
            seasons.saveAndFlush( current );
        } );
    }
}
