package com.sahdkhan.leaguemanager.season;

import com.sahdkhan.leaguemanager.config.JwtAuthFilter.AuthPrincipal;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
public class SeasonController {

    private final SeasonService seasons;

    public SeasonController(SeasonService seasons) {
        this.seasons = seasons;
    }

    public record CreateSeasonRequest(
            @NotBlank String name,
            LocalDate startsOn,
            LocalDate endsOn,
            boolean activate
    ) {}

    public record SeasonResponse(
            UUID id, String name, LocalDate startsOn, LocalDate endsOn, boolean active
    ) {}

    private SeasonResponse toResponse(Season season) {
        return new SeasonResponse(
                season.getId(), season.getName(), season.getStartsOn(), season.getEndsOn(), season.isActive()
        );
    }

    @GetMapping("/api/leagues/{leagueId}/seasons")
    public List<SeasonResponse> list(
            @PathVariable UUID leagueId,
            @AuthenticationPrincipal AuthPrincipal principal
    ) {
        return seasons.getSeasons(leagueId, principal.userId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @GetMapping("/api/leagues/{leagueId}/seasons/active")
    public SeasonResponse active(
            @PathVariable UUID leagueId,
            @AuthenticationPrincipal AuthPrincipal principal
    ) {
        return toResponse(seasons.getActiveSeason(leagueId, principal.userId()));
    }

    @PostMapping("/api/leagues/{leagueId}/seasons")
    public SeasonResponse create(
            @PathVariable UUID leagueId,
            @Valid @RequestBody CreateSeasonRequest req,
            @AuthenticationPrincipal AuthPrincipal principal
    ) {
        Season season = seasons.createSeason(
                leagueId, req.name(), req.startsOn(), req.endsOn(), req.activate(), principal.userId()
        );
        return toResponse(season);
    }

    @PutMapping("/api/seasons/{seasonId}/activate")
    public SeasonResponse activate(
            @PathVariable UUID seasonId,
            @AuthenticationPrincipal AuthPrincipal principal
    ) {
        return toResponse(seasons.activateSeason(seasonId, principal.userId()));
    }
}
