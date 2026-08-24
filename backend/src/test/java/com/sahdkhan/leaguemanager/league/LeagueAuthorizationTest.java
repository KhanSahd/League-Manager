package com.sahdkhan.leaguemanager.league;

import com.sahdkhan.leaguemanager.AbstractIntegrationTest;
import com.sahdkhan.leaguemanager.sports.Sport;
import com.sahdkhan.leaguemanager.sports.SportRepository;
import com.sahdkhan.leaguemanager.user.User;
import com.sahdkhan.leaguemanager.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Exercises the authorization matrix around leagues and teams: membership is
 * required to read, and only OWNER/ADMIN may write. Also covers the cascade
 * delete of a non-empty league, which previously threw a foreign-key violation.
 */
class LeagueAuthorizationTest extends AbstractIntegrationTest {

    @Autowired
    private UserRepository users;
    @Autowired
    private LeagueRepository leagues;
    @Autowired
    private LeagueMemberRepository members;
    @Autowired
    private SportRepository sports;
    @Autowired
    private BCryptPasswordEncoder encoder;

    private static final String SEEDED_PASSWORD = "correct-password";

    private String registerAndLogin(String email) {
        rest.postForEntity("/api/auth/register", Map.of(
                "firstName", "Test",
                "lastName", "User",
                "email", email,
                "password", "correct-password"
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

    @Test
    void spectator_cannotCreateTeamOrReadTeams() {
        String ownerToken = registerAndLogin("owner-" + UUID.randomUUID() + "@example.com");
        ResponseEntity<Map> leagueResponse = rest.exchange("/api/leagues", HttpMethod.POST,
                authed(Map.of("name", "Rec League", "sportId", basketballId()), ownerToken), Map.class);
        assertThat(leagueResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        UUID leagueId = UUID.fromString((String) leagueResponse.getBody().get("id"));

        User spectator = users.save(new User("Spec", "Tator",
                "spectator-" + UUID.randomUUID() + "@example.com", encoder.encode(SEEDED_PASSWORD)));
        members.save(new LeagueMember(spectator, leagues.findById(leagueId).orElseThrow(), LeagueRole.SPECTATOR));

        ResponseEntity<Map> login = rest.postForEntity("/api/auth/login",
                Map.of("email", spectator.getEmail(), "password", SEEDED_PASSWORD), Map.class);
        String spectatorToken = (String) login.getBody().get("token");

        ResponseEntity<Map> createTeam = rest.exchange(
                "/api/teams/league/" + leagueId, HttpMethod.POST,
                authed(Map.of("name", "Sharks"), spectatorToken), Map.class);
        assertThat(createTeam.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }

    @Test
    void nonMember_cannotReadLeagueTeams() {
        String ownerToken = registerAndLogin("owner-" + UUID.randomUUID() + "@example.com");
        ResponseEntity<Map> leagueResponse = rest.exchange("/api/leagues", HttpMethod.POST,
                authed(Map.of("name", "Rec League", "sportId", basketballId()), ownerToken), Map.class);
        UUID leagueId = UUID.fromString((String) leagueResponse.getBody().get("id"));

        String outsiderToken = registerAndLogin("outsider-" + UUID.randomUUID() + "@example.com");
        ResponseEntity<Map> response = rest.exchange(
                "/api/teams/league/" + leagueId, HttpMethod.GET,
                authed(null, outsiderToken), Map.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }

    @Test
    void owner_canDeleteLeagueWithTeamsAndPlayers() {
        String ownerToken = registerAndLogin("owner-" + UUID.randomUUID() + "@example.com");
        ResponseEntity<Map> leagueResponse = rest.exchange("/api/leagues", HttpMethod.POST,
                authed(Map.of("name", "Rec League", "sportId", basketballId()), ownerToken), Map.class);
        UUID leagueId = UUID.fromString((String) leagueResponse.getBody().get("id"));

        ResponseEntity<Map> teamResponse = rest.exchange(
                "/api/teams/league/" + leagueId, HttpMethod.POST,
                authed(Map.of("name", "Sharks"), ownerToken), Map.class);
        UUID teamId = UUID.fromString((String) teamResponse.getBody().get("id"));

        ResponseEntity<Map> playerResponse = rest.exchange("/api/teams/" + teamId + "/players", HttpMethod.POST,
                authed(Map.of("firstName", "Jane", "lastName", "Doe"), ownerToken), Map.class);
        assertThat(playerResponse.getStatusCode()).isEqualTo(HttpStatus.OK);

        ResponseEntity<Map> deleteResponse = rest.exchange(
                "/api/leagues/" + leagueId, HttpMethod.DELETE, authed(null, ownerToken), Map.class);

        assertThat(deleteResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(leagues.findById(leagueId)).isEmpty();
    }

    @Test
    void partialUpdate_leavesUnspecifiedFieldsUnchanged() {
        String ownerToken = registerAndLogin("owner-" + UUID.randomUUID() + "@example.com");
        ResponseEntity<Map> leagueResponse = rest.exchange("/api/leagues", HttpMethod.POST,
                authed(Map.of("name", "Rec League", "sportId", basketballId()), ownerToken), Map.class);
        UUID leagueId = UUID.fromString((String) leagueResponse.getBody().get("id"));

        Map<String, String> nameOnlyUpdate = new java.util.HashMap<>();
        nameOnlyUpdate.put("name", "Renamed League");
        ResponseEntity<Map> updateResponse = rest.exchange(
                "/api/leagues/" + leagueId, HttpMethod.PUT,
                authed(nameOnlyUpdate, ownerToken), Map.class);

        assertThat(updateResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(updateResponse.getBody().get("name")).isEqualTo("Renamed League");
        assertThat(updateResponse.getBody().get("sport")).isNotNull();
    }
}
