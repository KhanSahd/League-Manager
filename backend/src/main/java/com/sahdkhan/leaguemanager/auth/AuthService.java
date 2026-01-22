package com.sahdkhan.leaguemanager.auth;

import com.sahdkhan.leaguemanager.user.User;
import com.sahdkhan.leaguemanager.user.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Service class for handling user authentication.
 */
@Service
public class AuthService {

    private final UserRepository users;
    private final BCryptPasswordEncoder encoder;
    private final JwtService jwt;

    /**
     * Constructs an AuthService with the given dependencies.
     *
     * @param users   the user repository for accessing user data
     * @param encoder the password encoder for hashing passwords
     * @param jwt     the JWT service for generating tokens
     */
    public AuthService(UserRepository users,
                       BCryptPasswordEncoder encoder,
                       JwtService jwt) {
        this.users = users;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    // I need a method that gets all users from the database for testing purposes
    public Iterable<User> getAllUsers() {
        return users.findAll();
    }

    /**
     * Registers a new user with the given email and password.
     *
     * @param email    the user's email
     * @param password the user's password
     * @return a JWT token for the newly registered user
     * @throws IllegalArgumentException if the email is already registered
     */
    public String register(String email, String password) {
        if (users.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already registered");
        }
        User user = new User(email, encoder.encode(password));
        users.save(user);
        return jwt.generate(user.getId(), user.getEmail());
    }

    /**
     * Logs in a user with the given email and password.
     *
     * @param email    the user's email
     * @param password the user's password
     * @return a JWT token for the logged-in user
     * @throws IllegalArgumentException if the credentials are invalid
     */
    public String login(String email, String password) {
        User user = users.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
        if (!encoder.matches(password, user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        return jwt.generate(user.getId(), user.getEmail());
    }
}
