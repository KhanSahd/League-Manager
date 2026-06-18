package com.sahdkhan.leaguemanager.user;

import com.sahdkhan.leaguemanager.responses.UserResponse;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class MeService
{
    public UserRepository userRepository;

    public MeService( UserRepository userRepository )
    {
        this.userRepository = userRepository;
    }

    public User getMe( UUID userId )
    {
        return userRepository.findById( userId ).orElseThrow();
    }
}
