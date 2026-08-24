package com.sahdkhan.leaguemanager.league;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface LeagueInviteRepository extends JpaRepository<LeagueInvite, UUID> {
    Optional<LeagueInvite> findByCode(String code);
    List<LeagueInvite> findByLeague(League league);
}
