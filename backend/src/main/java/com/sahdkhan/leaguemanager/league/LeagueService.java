package com.sahdkhan.leaguemanager.league;

import com.sahdkhan.leaguemanager.user.User;
import com.sahdkhan.leaguemanager.user.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class LeagueService {

    private final LeagueRepository leagues;
    private final LeagueMemberRepository members;
    private final UserRepository users;

    public LeagueService(
            LeagueRepository leagues,
            LeagueMemberRepository members,
            UserRepository users
    ) {
        this.leagues = leagues;
        this.members = members;
        this.users = users;
    }

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
