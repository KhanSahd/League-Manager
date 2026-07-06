package com.sahdkhan.leaguemanager.sports;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SportRepository extends JpaRepository<Sport, UUID >
{
    java.util.Optional<Sport> findByName( String name );

    java.util.Optional<Sport> findById( UUID id );
}
