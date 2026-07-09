package com.sahdkhan.leaguemanager.passwordReset;

import com.sahdkhan.leaguemanager.user.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "reset_token")
public class ResetToken
{

    @Id
    @GeneratedValue
    private UUID id;

    private String token;

    private LocalDateTime expiresAt;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public boolean isExpired() {
        return expiresAt.isBefore(LocalDateTime.now());
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public User getUser()
    {
        return user;
    }
}
