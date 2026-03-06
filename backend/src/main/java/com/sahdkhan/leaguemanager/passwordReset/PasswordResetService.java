package com.sahdkhan.leaguemanager.passwordReset;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import com.sahdkhan.leaguemanager.exceptions.UnableToSendEmailException;
import com.sahdkhan.leaguemanager.user.User;
import com.sahdkhan.leaguemanager.user.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;

@Service
public class PasswordResetService
{
    private static final SecureRandom secureRandom = new SecureRandom();
    private final UserRepository users;
    private final ResetTokenRepository resetTokenRepository;
    private Resend mailSender;

    public PasswordResetService(UserRepository users,
                                ResetTokenRepository resetTokenRepository,
                                @Value("${resend.api.key}") String resendApiKey) {
        this.users = users;
        this.resetTokenRepository = resetTokenRepository;
        this.mailSender = new Resend( resendApiKey );
    }

    /**
     * Generates a secure random token for password reset.
     * @return a URL-safe base64 encoded token string
     */
    public String makeResetToken() {
        byte[] bytes = new byte[32];
        new SecureRandom().nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    /**
     * Hashes the given token using SHA-256 and encodes it in URL-safe base64.
     * This is used to securely store the token in the database without exposing the raw token.
     * @param token the raw token to hash
     * @return a hashed and encoded version of the token
     */
    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashed = digest.digest(token.getBytes());

            return Base64.getUrlEncoder()
                    .withoutPadding()
                    .encodeToString(hashed);

        } catch (Exception e) {
            throw new RuntimeException("Token hashing failed", e);
        }
    }

    /**
     * Processes a password reset request for the given email. If the email is registered,
     * it generates a reset token, saves it to the database, and sends a reset email
     * @param email the email address to send the reset link to
     */
    public void processRequest(String email)
    {
        Optional<User> userOpt = users.findByEmail(email);

        if (userOpt.isEmpty()) {
            System.out.println("user not found for email: " + email);
            return; // silently ignore to avoid revealing which emails are registered
        }

        User user = userOpt.get();
        String token = makeResetToken();

        ResetToken record = new ResetToken();
        record.setToken(hashToken( token ));
        record.setUser(user);
        record.setExpiresAt( LocalDateTime.now().plusMinutes(30));

        resetTokenRepository.deleteByUserId(user.getId() ); // invalidate any existing tokens for this user
        resetTokenRepository.save(record);

        try
        {
            sendEmail(user.getEmail(), token);
        }
        catch ( ResendException e )
        {
            throw new UnableToSendEmailException( e.getMessage() );
        }
    }

    public void sendEmail(String email, String token) throws ResendException
    {
        String resetUrl = "leaguemanager://reset-password?token=" + token;

        CreateEmailOptions params = CreateEmailOptions.builder()
                .from("noreply@sahdkhan.com")
                .to(email)
                .subject("Reset your password")
                .html("<p>Click below to reset your password:</p>"
                        + "<a href=\"" + resetUrl + "\">Reset Password</a>")
                .build();
        mailSender.emails().send(params);
    }
}
