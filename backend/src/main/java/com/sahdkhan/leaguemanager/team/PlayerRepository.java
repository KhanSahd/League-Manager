package com.sahdkhan.leaguemanager.team;

import com.sahdkhan.leaguemanager.league.League;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PlayerRepository extends JpaRepository<Player, UUID> {
    List<Player> findByLeague(League league);
}
