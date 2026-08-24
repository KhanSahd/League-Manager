package com.sahdkhan.leaguemanager.league;

import com.sahdkhan.leaguemanager.exceptions.ForbiddenException;
import com.sahdkhan.leaguemanager.team.Team;
import com.sahdkhan.leaguemanager.user.User;
import org.springframework.stereotype.Service;

import java.util.Set;

/**
 * Central place for "can this user do this in this league" checks, shared by
 * every service that touches league-scoped data (teams, rosters, seasons, ...).
 */
@Service
public class LeagueAccessService {

    private static final Set<LeagueRole> ADMIN_ROLES = Set.of(LeagueRole.OWNER, LeagueRole.ADMIN);

    private final LeagueMemberRepository members;

    public LeagueAccessService(LeagueMemberRepository members) {
        this.members = members;
    }

    /** Any membership at all — required just to read league-scoped data. */
    public LeagueMember requireMembership(League league, User user) {
        return members.findByLeagueAndUser(league, user)
                .orElseThrow(() -> new ForbiddenException("Not a member of this league"));
    }

    /** OWNER or ADMIN — required to create/update/delete league-wide resources. */
    public LeagueMember requireAdmin(League league, User user) {
        LeagueMember m = requireMembership(league, user);
        if (!ADMIN_ROLES.contains(m.getRole())) {
            throw new ForbiddenException("Insufficient privileges");
        }
        return m;
    }

    /**
     * OWNER/ADMIN, or a TEAM_MANAGER scoped to the given team — required to
     * manage one team's roster without needing full league admin rights.
     */
    public LeagueMember requireTeamManageAccess(League league, User user, Team team) {
        LeagueMember m = requireMembership(league, user);
        if (ADMIN_ROLES.contains(m.getRole())) {
            return m;
        }
        if (m.getRole() == LeagueRole.TEAM_MANAGER && m.getTeam() != null && m.getTeam().getId().equals(team.getId())) {
            return m;
        }
        throw new ForbiddenException("Insufficient privileges");
    }
}
