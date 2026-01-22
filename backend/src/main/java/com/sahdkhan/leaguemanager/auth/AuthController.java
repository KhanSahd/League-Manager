package com.sahdkhan.leaguemanager.auth;

import com.sahdkhan.leaguemanager.user.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for handling authentication requests such as registration and login.
 * It exposes endpoints for user registration and login, returning authentication tokens upon success.
 * Uses AuthService to perform the actual authentication logic.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService auth;

    /**
     * Constructs an AuthController with the given AuthService.
     *
     * @param auth the authentication service to be used
     */
    public AuthController(AuthService auth) {
        this.auth = auth;
    }

    /** Data transfer object for authentication requests. */
    record AuthRequest(@Email String email, @NotBlank String password) {}
    /** Data transfer object for authentication responses. */
    record AuthResponse(String token) {}

    /** Endpoint for getting all users (for testing purposes). */
    @GetMapping("/users")
    public Iterable< User > getAllUsers() {
        return auth.getAllUsers();
    }

    /** Endpoint for user registration. */
    @PostMapping("/register")
    public AuthResponse register(@RequestBody AuthRequest req) {
        return new AuthResponse(auth.register(req.email(), req.password()));
    }

    /** Endpoint for user login. */
    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest req) {
        return new AuthResponse(auth.login(req.email(), req.password()));
    }
}
