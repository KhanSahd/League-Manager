package com.sahdkhan.leaguemanager.league;

import com.sahdkhan.leaguemanager.user.User;
import com.sahdkhan.leaguemanager.user.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

/**
 * Service class for managing leagues and league members.
 */
@Service
public class LeagueService {

    private final LeagueRepository leagues;
    private final LeagueMemberRepository members;
    private final UserRepository users;

    /**
     * Constructs a LeagueService with the given repositories.
     * @param leagues the league repository
     * @param members the league member repository
     * @param users the user repository
     */
    public LeagueService(
            LeagueRepository leagues,
            LeagueMemberRepository members,
            UserRepository users
    ) {
        this.leagues = leagues;
        this.members = members;
        this.users = users;
    }

    /**
     * Creates a new league with the specified name and sport, and assigns the user as the owner.
     * @param userId the ID of the user creating the league
     * @param name the name of the league
     * @param sport the sport of the league
     * @return the created league
     */
    public League createLeague(UUID userId, String name, String sport) {
        User owner = users.findById(userId).orElseThrow();
        League league = leagues.save(new League(name, sport));
        members.save(new LeagueMember(owner, league, LeagueRole.OWNER));
        return league;
    }

    public List<LeagueMember> myLeagues(UUID userId) {
        User user = users.findById(userId).orElseThrow();
        return members.findByUser(user);
    }
}
