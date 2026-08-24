package com.sahdkhan.leaguemanager.league;

import com.sahdkhan.leaguemanager.team.Team;
import com.sahdkhan.leaguemanager.team.TeamRepository;
import com.sahdkhan.leaguemanager.user.User;
import com.sahdkhan.leaguemanager.user.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class LeagueInviteService {

    /** Excludes visually ambiguous characters (0/O, 1/I/L). */
    private static final String CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
    private static final int CODE_LENGTH = 6;
    private static final SecureRandom RANDOM = new SecureRandom();

    private final LeagueInviteRepository invites;
    private final LeagueRepository leagues;
    private final LeagueMemberRepository members;
    private final TeamRepository teams;
    private final UserRepository users;
    private final LeagueAccessService access;

    public LeagueInviteService(
            LeagueInviteRepository invites,
            LeagueRepository leagues,
            LeagueMemberRepository members,
            TeamRepository teams,
            UserRepository users,
            LeagueAccessService access
    ) {
        this.invites = invites;
        this.leagues = leagues;
        this.members = members;
        this.teams = teams;
        this.users = users;
        this.access = access;
    }

    public List<LeagueInvite> getInvites( UUID leagueId, UUID userId ) {
        League league = leagues.findById( leagueId ).orElseThrow();
        access.requireAdmin( league, users.findById( userId ).orElseThrow() );
        return invites.findByLeague( league );
    }

    public LeagueInvite createInvite(
            UUID leagueId, LeagueRole role, Instant expiresAt, Integer maxUses, UUID teamId, UUID userId
    ) {
        League league = leagues.findById( leagueId ).orElseThrow();
        access.requireAdmin( league, users.findById( userId ).orElseThrow() );

        Team team = null;
        if ( teamId != null ) {
            team = teams.findById( teamId ).orElseThrow();
            if ( !team.getLeague().getId().equals( league.getId() ) ) {
                throw new IllegalArgumentException( "That team does not belong to this league" );
            }
        }

        String code;
        do {
            code = generateCode();
        } while ( invites.findByCode( code ).isPresent() );

        return invites.save( new LeagueInvite( league, code, role, expiresAt, maxUses, team ) );
    }

    private String generateCode() {
        StringBuilder sb = new StringBuilder( CODE_LENGTH );
        for ( int i = 0; i < CODE_LENGTH; i++ ) {
            sb.append( CODE_ALPHABET.charAt( RANDOM.nextInt( CODE_ALPHABET.length() ) ) );
        }
        return sb.toString();
    }

    @Transactional
    public LeagueMember redeem( String code, UUID userId ) {
        LeagueInvite invite = invites.findByCode( code.toUpperCase() )
                .orElseThrow( () -> new IllegalArgumentException( "Invite code not found" ) );

        if ( invite.isExpired() ) {
            throw new IllegalArgumentException( "This invite code has expired" );
        }
        if ( invite.isExhausted() ) {
            throw new IllegalArgumentException( "This invite code has already been used" );
        }

        User user = users.findById( userId ).orElseThrow();
        League league = invite.getLeague();

        if ( members.findByLeagueAndUser( league, user ).isPresent() ) {
            throw new IllegalArgumentException( "You're already a member of this league" );
        }

        invite.recordUse();
        invites.save( invite );

        return members.save( new LeagueMember( user, league, invite.getRole(), invite.getTeam() ) );
    }
}
