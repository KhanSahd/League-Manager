package com.sahdkhan.leaguemanager.auth;

import com.sahdkhan.leaguemanager.AbstractIntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class AuthFlowTest extends AbstractIntegrationTest {

    private Map<String, String> registerRequest(String email) {
        return Map.of(
                "firstName", "Test",
                "lastName", "User",
                "email", email,
                "password", "correct-password"
        );
    }

    @Test
    void registerThenLogin_returnsUsableToken() {
        String email = "player-" + UUID.randomUUID() + "@example.com";

        ResponseEntity<Map> registerResponse = rest.postForEntity(
                "/api/auth/register", registerRequest(email), Map.class);
        assertThat(registerResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(registerResponse.getBody()).containsKey("token");

        ResponseEntity<Map> loginResponse = rest.postForEntity(
                "/api/auth/login",
                Map.of("email", email, "password", "correct-password"),
                Map.class);
        assertThat(loginResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(loginResponse.getBody()).containsKey("token");
    }

    @Test
    void login_withWrongPassword_returns401() {
        String email = "player-" + UUID.randomUUID() + "@example.com";
        rest.postForEntity("/api/auth/register", registerRequest(email), Map.class);

        ResponseEntity<Map> response = rest.postForEntity(
                "/api/auth/login",
                Map.of("email", email, "password", "wrong-password"),
                Map.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    void register_withDuplicateEmail_returns400() {
        String email = "player-" + UUID.randomUUID() + "@example.com";
        rest.postForEntity("/api/auth/register", registerRequest(email), Map.class);

        ResponseEntity<Map> response = rest.postForEntity(
                "/api/auth/register", registerRequest(email), Map.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void register_withBlankName_returns400() {
        Map<String, String> invalid = Map.of(
                "firstName", "",
                "lastName", "User",
                "email", "player-" + UUID.randomUUID() + "@example.com",
                "password", "correct-password"
        );

        ResponseEntity<Map> response = rest.postForEntity("/api/auth/register", invalid, Map.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void usersEndpoint_noLongerExists() {
        ResponseEntity<String> response = rest.getForEntity("/api/auth/users", String.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }
}
