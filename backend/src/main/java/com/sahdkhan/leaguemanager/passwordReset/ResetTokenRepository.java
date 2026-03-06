package com.sahdkhan.leaguemanager.passwordReset;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ResetTokenRepository extends JpaRepository<ResetToken, UUID >
{
    void deleteByUserId( UUID userId );

    Optional<ResetToken> findByToken( String token);
}
