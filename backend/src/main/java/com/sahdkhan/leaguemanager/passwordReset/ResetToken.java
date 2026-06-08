package com.sahdkhan.leaguemanager.passwordReset;

import com.sahdkhan.leaguemanager.user.User;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

import java.time.LocalDateTime;

@Entity
public class ResetToken
{

    @Id
    @GeneratedValue
    private Long id;

    private String token;

    private LocalDateTime expiresAt;

    @ManyToOne
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
