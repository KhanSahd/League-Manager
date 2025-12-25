package com.sahdkhan.leaguemanager.league;

import com.sahdkhan.leaguemanager.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface LeagueMemberRepository extends JpaRepository<LeagueMember, UUID> {
    List<LeagueMember> findByUser(User user);
}
