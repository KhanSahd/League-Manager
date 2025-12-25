package com.sahdkhan.leaguemanager.user;

import com.sahdkhan.leaguemanager.config.JwtAuthFilter.AuthPrincipal;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api")
public class MeController {

    record MeResponse(UUID id, String email) {}

    @GetMapping("/me")
    public MeResponse me(@AuthenticationPrincipal AuthPrincipal principal) {
        return new MeResponse(principal.userId(), principal.email());
    }
}
