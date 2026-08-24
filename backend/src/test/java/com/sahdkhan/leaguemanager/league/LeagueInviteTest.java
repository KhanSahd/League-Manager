package com.sahdkhan.leaguemanager.league;

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

import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class LeagueInviteTest extends AbstractIntegrationTest {

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

    private UUID createLeague(String ownerToken) {
        UUID basketballId = sports.findByName("Basketball").map(Sport::getId).orElseThrow();
        ResponseEntity<Map> response = rest.exchange("/api/leagues", HttpMethod.POST,
                authed(Map.of("name", "Rec League " + UUID.randomUUID(), "sportId", basketballId), ownerToken), Map.class);
        return UUID.fromString((String) response.getBody().get("id"));
    }

    @Test
    void redeemingAValidCode_addsTheCallerAsAMember() {
        String ownerToken = registerAndLogin("owner-" + UUID.randomUUID() + "@example.com");
        UUID leagueId = createLeague(ownerToken);

        ResponseEntity<Map> invite = rest.exchange("/api/leagues/" + leagueId + "/invites", HttpMethod.POST,
                authed(Map.of("role", "MEMBER"), ownerToken), Map.class);
        String code = (String) invite.getBody().get("code");

        String joinerToken = registerAndLogin("joiner-" + UUID.randomUUID() + "@example.com");
        ResponseEntity<Map> redeem = rest.exchange("/api/invites/redeem", HttpMethod.POST,
                authed(Map.of("code", code), joinerToken), Map.class);

        assertThat(redeem.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(redeem.getBody().get("role")).isEqualTo("MEMBER");

        ResponseEntity<Map> teams = rest.exchange("/api/teams/league/" + leagueId, HttpMethod.GET,
                authed(null, joinerToken), Map.class);
        assertThat(teams.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void redeemingAnExhaustedCode_isRejected() {
        String ownerToken = registerAndLogin("owner-" + UUID.randomUUID() + "@example.com");
        UUID leagueId = createLeague(ownerToken);

        ResponseEntity<Map> invite = rest.exchange("/api/leagues/" + leagueId + "/invites", HttpMethod.POST,
                authed(Map.of("role", "MEMBER", "maxUses", 1), ownerToken), Map.class);
        String code = (String) invite.getBody().get("code");

        String firstJoiner = registerAndLogin("joiner1-" + UUID.randomUUID() + "@example.com");
        rest.exchange("/api/invites/redeem", HttpMethod.POST, authed(Map.of("code", code), firstJoiner), Map.class);

        String secondJoiner = registerAndLogin("joiner2-" + UUID.randomUUID() + "@example.com");
        ResponseEntity<Map> redeem = rest.exchange("/api/invites/redeem", HttpMethod.POST,
                authed(Map.of("code", code), secondJoiner), Map.class);

        assertThat(redeem.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void redeemingAnExpiredCode_isRejected() {
        String ownerToken = registerAndLogin("owner-" + UUID.randomUUID() + "@example.com");
        UUID leagueId = createLeague(ownerToken);

        ResponseEntity<Map> invite = rest.exchange("/api/leagues/" + leagueId + "/invites", HttpMethod.POST,
                authed(Map.of("role", "MEMBER", "expiresInHours", -1), ownerToken), Map.class);
        String code = (String) invite.getBody().get("code");

        String joinerToken = registerAndLogin("joiner-" + UUID.randomUUID() + "@example.com");
        ResponseEntity<Map> redeem = rest.exchange("/api/invites/redeem", HttpMethod.POST,
                authed(Map.of("code", code), joinerToken), Map.class);

        assertThat(redeem.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void redeemingCode_forLeagueAlreadyJoined_isRejected() {
        String ownerToken = registerAndLogin("owner-" + UUID.randomUUID() + "@example.com");
        UUID leagueId = createLeague(ownerToken);

        ResponseEntity<Map> invite = rest.exchange("/api/leagues/" + leagueId + "/invites", HttpMethod.POST,
                authed(Map.of("role", "MEMBER"), ownerToken), Map.class);
        String code = (String) invite.getBody().get("code");

        ResponseEntity<Map> redeem = rest.exchange("/api/invites/redeem", HttpMethod.POST,
                authed(Map.of("code", code), ownerToken), Map.class);

        assertThat(redeem.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void redeemingAnUnknownCode_isRejected() {
        String userToken = registerAndLogin("user-" + UUID.randomUUID() + "@example.com");
        ResponseEntity<Map> redeem = rest.exchange("/api/invites/redeem", HttpMethod.POST,
                authed(Map.of("code", "NOTREAL"), userToken), Map.class);

        assertThat(redeem.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }
}
