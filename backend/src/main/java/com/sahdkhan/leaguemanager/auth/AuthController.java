package com.sahdkhan.leaguemanager.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService auth;

    public AuthController(AuthService auth) {
        this.auth = auth;
    }

    record AuthRequest(@Email String email, @NotBlank String password) {}
    record AuthResponse(String token) {}

    @PostMapping("/register")
    public AuthResponse register(@RequestBody AuthRequest req) {
        return new AuthResponse(auth.register(req.email(), req.password()));
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest req) {
        return new AuthResponse(auth.login(req.email(), req.password()));
    }
}
