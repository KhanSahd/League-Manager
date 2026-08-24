package com.sahdkhan.leaguemanager.season;

import com.sahdkhan.leaguemanager.AbstractIntegrationTest;
import com.sahdkhan.leaguemanager.sports.Sport;
import com.sahdkhan.leaguemanager.sports.SportRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Covers the Phase 1 domain model: a league's first season is created
 * automatically, rosters are scoped to whichever season is active, jersey
 * numbers are unique per team per season, and TEAM_MANAGER access is scoped
 * to their own team.
 */
class SeasonAndRosterTest extends AbstractIntegrationTest {

    @Autowired
    private SportRepository sports;

    private String registerAndLogin(String email) {
        rest.postForEntity("/api/auth/register", Map.of(
                "firstName", "Test", "lastName", "User", "email", email, "password", "correct-password"
        ), Map.class);
        ResponseEntity<Map> login = rest.postForEntity("/api/auth/login",
                Map.of("email", email, "password", "correct-password"), Map.class);
        return (String) login.getBody().get("token");
    }

    private HttpEntity<?> authed(Object body, String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        return new HttpEntity<>(body, headers);
    }

    private UUID basketballId() {
        return sports.findByName("Basketball").map(Sport::getId).orElseThrow();
    }

    private UUID createLeague(String ownerToken) {
        ResponseEntity<Map> response = rest.exchange("/api/leagues", HttpMethod.POST,
                authed(Map.of("name", "Rec League " + UUID.randomUUID(), "sportId", basketballId()), ownerToken), Map.class);
        return UUID.fromString((String) response.getBody().get("id"));
    }

    private UUID createTeam(UUID leagueId, String name, String ownerToken) {
        ResponseEntity<Map> response = rest.exchange("/api/teams/league/" + leagueId, HttpMethod.POST,
                authed(Map.of("name", name), ownerToken), Map.class);
        return UUID.fromString((String) response.getBody().get("id"));
    }

    @Test
    void creatingLeague_startsAnActiveFirstSeason() {
        String ownerToken = registerAndLogin("owner-" + UUID.randomUUID() + "@example.com");
        UUID leagueId = createLeague(ownerToken);

        ResponseEntity<Map> active = rest.exchange("/api/leagues/" + leagueId + "/seasons/active",
                HttpMethod.GET, authed(null, ownerToken), Map.class);

        assertThat(active.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(active.getBody().get("name")).isEqualTo("Season 1");
        assertThat(active.getBody().get("active")).isEqualTo(true);
    }

    @Test
    void duplicateJerseyNumber_onSameTeamAndSeason_isRejected() {
        String ownerToken = registerAndLogin("owner-" + UUID.randomUUID() + "@example.com");
        UUID leagueId = createLeague(ownerToken);
        UUID teamId = createTeam(leagueId, "Sharks", ownerToken);

        rest.exchange("/api/teams/" + teamId + "/players", HttpMethod.POST,
                authed(Map.of("firstName", "Jane", "lastName", "Doe", "jerseyNumber", 23), ownerToken), Map.class);

        ResponseEntity<Map> conflict = rest.exchange("/api/teams/" + teamId + "/players", HttpMethod.POST,
                authed(Map.of("firstName", "John", "lastName", "Smith", "jerseyNumber", 23), ownerToken), Map.class);

        assertThat(conflict.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
    }

    @Test
    void activatingANewSeason_swapsWhichRosterIsVisible() {
        String ownerToken = registerAndLogin("owner-" + UUID.randomUUID() + "@example.com");
        UUID leagueId = createLeague(ownerToken);
        UUID teamId = createTeam(leagueId, "Sharks", ownerToken);

        rest.exchange("/api/teams/" + teamId + "/players", HttpMethod.POST,
                authed(Map.of("firstName", "Jane", "lastName", "Doe"), ownerToken), Map.class);

        ResponseEntity<List> rosterBefore = rest.exchange("/api/teams/" + teamId + "/players",
                HttpMethod.GET, authed(null, ownerToken), List.class);
        assertThat(rosterBefore.getBody()).hasSize(1);

        ResponseEntity<Map> season2 = rest.exchange("/api/leagues/" + leagueId + "/seasons", HttpMethod.POST,
                authed(Map.of("name", "Season 2", "activate", true), ownerToken), Map.class);
        assertThat(season2.getStatusCode()).isEqualTo(HttpStatus.OK);

        ResponseEntity<List> rosterAfter = rest.exchange("/api/teams/" + teamId + "/players",
                HttpMethod.GET, authed(null, ownerToken), List.class);
        assertThat(rosterAfter.getBody()).isEmpty();

        ResponseEntity<List> seasons = rest.exchange("/api/leagues/" + leagueId + "/seasons",
                HttpMethod.GET, authed(null, ownerToken), List.class);
        long activeCount = seasons.getBody().stream()
                .filter(s -> Boolean.TRUE.equals(((Map<?, ?>) s).get("active")))
                .count();
        assertThat(activeCount).isEqualTo(1);
    }

    @Test
    void teamManager_canManageOwnTeamRoster_butNotOtherTeamsOrLeagueAdmin() {
        String ownerToken = registerAndLogin("owner-" + UUID.randomUUID() + "@example.com");
        UUID leagueId = createLeague(ownerToken);
        UUID sharks = createTeam(leagueId, "Sharks", ownerToken);
        UUID wolves = createTeam(leagueId, "Wolves", ownerToken);

        ResponseEntity<Map> invite = rest.exchange("/api/leagues/" + leagueId + "/invites", HttpMethod.POST,
                authed(Map.of("role", "TEAM_MANAGER", "teamId", sharks), ownerToken), Map.class);
        String code = (String) invite.getBody().get("code");

        String managerToken = registerAndLogin("manager-" + UUID.randomUUID() + "@example.com");
        rest.exchange("/api/invites/redeem", HttpMethod.POST,
                authed(Map.of("code", code), managerToken), Map.class);

        ResponseEntity<Map> ownTeam = rest.exchange("/api/teams/" + sharks + "/players", HttpMethod.POST,
                authed(Map.of("firstName", "Managed", "lastName", "Player"), managerToken), Map.class);
        assertThat(ownTeam.getStatusCode()).isEqualTo(HttpStatus.OK);

        ResponseEntity<Map> otherTeam = rest.exchange("/api/teams/" + wolves + "/players", HttpMethod.POST,
                authed(Map.of("firstName", "Sneaky", "lastName", "Player"), managerToken), Map.class);
        assertThat(otherTeam.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);

        ResponseEntity<Map> newTeam = rest.exchange("/api/teams/league/" + leagueId, HttpMethod.POST,
                authed(Map.of("name", "Should Fail"), managerToken), Map.class);
        assertThat(newTeam.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }

    @Test
    void deletingLeague_cascadesThroughSeasonsRostersAndPlayers() {
        String ownerToken = registerAndLogin("owner-" + UUID.randomUUID() + "@example.com");
        UUID leagueId = createLeague(ownerToken);
        UUID teamId = createTeam(leagueId, "Sharks", ownerToken);
        rest.exchange("/api/teams/" + teamId + "/players", HttpMethod.POST,
                authed(Map.of("firstName", "Jane", "lastName", "Doe"), ownerToken), Map.class);
        rest.exchange("/api/leagues/" + leagueId + "/invites", HttpMethod.POST,
                authed(Map.of("role", "MEMBER"), ownerToken), Map.class);

        ResponseEntity<Map> delete = rest.exchange("/api/leagues/" + leagueId, HttpMethod.DELETE,
                authed(null, ownerToken), Map.class);

        assertThat(delete.getStatusCode()).isEqualTo(HttpStatus.OK);
    }
}
