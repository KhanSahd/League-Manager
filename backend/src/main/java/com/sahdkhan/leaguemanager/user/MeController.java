package com.sahdkhan.leaguemanager.user;

import com.sahdkhan.leaguemanager.config.JwtAuthFilter.AuthPrincipal;
import com.sahdkhan.leaguemanager.responses.UserResponse;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api")
public class MeController {

    public MeService meService;

    public MeController( MeService meService )
    {
        this.meService = meService;
    }

    @GetMapping("/me")
    public UserResponse me( @AuthenticationPrincipal AuthPrincipal principal )
    {
        User user = meService.getMe( principal.userId() );
        return new UserResponse(
                user.getId().toString(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail()
        );
    }
}
