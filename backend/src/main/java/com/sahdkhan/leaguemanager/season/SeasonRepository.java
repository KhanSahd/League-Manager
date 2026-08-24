package com.sahdkhan.leaguemanager.season;

import com.sahdkhan.leaguemanager.league.League;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SeasonRepository extends JpaRepository<Season, UUID> {
    List<Season> findByLeagueOrderByStartsOnDesc(League league);
    Optional<Season> findByLeagueAndActiveTrue(League league);
}
