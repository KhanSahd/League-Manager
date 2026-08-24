package com.sahdkhan.leaguemanager.league;

import com.sahdkhan.leaguemanager.config.JwtAuthFilter.AuthPrincipal;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@RestController
public class LeagueInviteController {

    private final LeagueInviteService invites;

    public LeagueInviteController(LeagueInviteService invites) {
        this.invites = invites;
    }

    public record CreateInviteRequest(
            @NotNull LeagueRole role,
            Integer expiresInHours,
            Integer maxUses,
            UUID teamId
    ) {}

    public record InviteResponse(
            UUID id, String code, LeagueRole role, Instant expiresAt, Integer maxUses, int uses, UUID teamId
    ) {}

    public record RedeemInviteRequest(@NotBlank String code) {}

    public record RedeemInviteResponse(UUID leagueId, String leagueName, LeagueRole role) {}

    private InviteResponse toResponse(LeagueInvite invite) {
        return new InviteResponse(
                invite.getId(), invite.getCode(), invite.getRole(),
                invite.getExpiresAt(), invite.getMaxUses(), invite.getUses(),
                invite.getTeam() == null ? null : invite.getTeam().getId()
        );
    }

    @GetMapping("/api/leagues/{leagueId}/invites")
    public List<InviteResponse> list(
            @PathVariable UUID leagueId,
            @AuthenticationPrincipal AuthPrincipal principal
    ) {
        return invites.getInvites(leagueId, principal.userId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @PostMapping("/api/leagues/{leagueId}/invites")
    public InviteResponse create(
            @PathVariable UUID leagueId,
            @Valid @RequestBody CreateInviteRequest req,
            @AuthenticationPrincipal AuthPrincipal principal
    ) {
        Instant expiresAt = req.expiresInHours() == null
                ? null
                : Instant.now().plus(req.expiresInHours(), ChronoUnit.HOURS);
        LeagueInvite invite = invites.createInvite(
                leagueId, req.role(), expiresAt, req.maxUses(), req.teamId(), principal.userId()
        );
        return toResponse(invite);
    }

    @PostMapping("/api/invites/redeem")
    public RedeemInviteResponse redeem(
            @Valid @RequestBody RedeemInviteRequest req,
            @AuthenticationPrincipal AuthPrincipal principal
    ) {
        LeagueMember member = invites.redeem(req.code(), principal.userId());
        return new RedeemInviteResponse(
                member.getLeague().getId(), member.getLeague().getName(), member.getRole()
        );
    }
}
