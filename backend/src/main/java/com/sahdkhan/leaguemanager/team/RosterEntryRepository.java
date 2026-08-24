package com.sahdkhan.leaguemanager.team;

import com.sahdkhan.leaguemanager.season.Season;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RosterEntryRepository extends JpaRepository<RosterEntry, UUID> {
    List<RosterEntry> findBySeasonAndTeam(Season season, Team team);
    List<RosterEntry> findByTeam(Team team);
    List<RosterEntry> findByPlayer(Player player);
    Optional<RosterEntry> findBySeasonAndTeamAndPlayer(Season season, Team team, Player player);
}
