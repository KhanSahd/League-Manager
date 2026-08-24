# League Manager — Development Roadmap

_Last updated: 2026-08-24 — Phase 0 and Phase 1 complete._

## Where the project actually stands

The monorepo has a working **Spring Boot 3.3.4 / Java 17 / Postgres / Flyway** API and an
**Expo 54 / RN 0.81 / Redux Toolkit / NativeWind** mobile client. Auth (JWT + password
reset via Resend), leagues, teams, players, and a sports catalog all work end to end.

What does **not** exist is the entire reason someone would use a league manager:
**there are no games, no scores, no stats, and no standings.** Today the product is a
CRUD directory of leagues → teams → player names. Everything below is about closing
that gap in the right order.

### The single most important structural gap

`league → team → player` has no **season** in it, and `player` is a bare name bolted to
one team. Leagues run repeatedly; rosters change every season; "track player performance
over time" is impossible with the current shape. Adding seasons later means migrating
every game and stat row that exists by then. **Do it before games ship (Phase 1).**

---

## Phase 0 — Stabilize (~1 week)

Nothing new gets built on a foundation with open authorization holes and a red typecheck.

### Security / correctness (backend)

| # | Issue | Where |
|---|---|---|
| 1 | `GET /api/auth/users` returns **every user unauthenticated** (`/api/auth/**` is `permitAll`). Delete it. | `auth/AuthController.java` |
| 2 | `GET /api/teams/league/{leagueId}` and `GET /api/teams/{teamId}/players` do **no membership check** — any logged-in user reads any league's roster. | `team/TeamController.java` |
| 3 | `requireAdmin` blacklists only `MEMBER`, so **`SPECTATOR` passes as an admin**. Switch to a whitelist of `OWNER`/`ADMIN`. | `LeagueService`, `TeamService` |
| 4 | `deleteLeague` removes members + league but not teams/players → **FK violation on any non-empty league**. | `LeagueService.deleteLeague` |
| 5 | `POST /api/sports` lets any user mutate the **global** sports catalog. Seed via Flyway, gate the endpoint. | `sports/SportController.java` |
| 6 | No `@Valid` on any `@RequestBody` — every validation annotation is dead. Also `@NotBlank UUID sportId` is invalid for a non-`CharSequence` type and will throw once validation is switched on. | all controllers |
| 7 | `updateLeague` writes `name`/`sport` unconditionally, so a partial `PUT` **nulls the other field**. | `LeagueService.updateLeague` |
| 8 | Create/update/delete responses hardcode `LeagueRole.OWNER` regardless of the caller's real role. | `LeagueController` |
| 9 | `.cors(Customizer.withDefaults())` with **no `CorsConfigurationSource` bean** — nothing is actually allowed. Blocks the web app in Phase 5. | `config/SecurityConfig.java` |
| 10 | `orElseThrow()` everywhere → `NoSuchElementException` → **500s instead of 404s**. Map them in `GlobalExceptionHandler`. | services + `exceptions/` |
| 11 | `LeagueResponse` serializes the `Sport` **JPA entity** directly. Use DTO records at every boundary. | `LeagueController` |

### Build health

- **Tests are globally disabled**: `tasks.withType(Test).configureEach { enabled = false }` in `build.gradle`. Remove it. `src/test/java` is empty.
- Add **Testcontainers** + first slice tests: auth flow, league authz matrix, cascade delete.
- `npx tsc --noEmit` reports **10 errors**. Add `typecheck` and `lint` npm scripts.
- Add **GitHub Actions CI**: `./gradlew build` + `tsc --noEmit` on every push. There is no `.github/` directory today.

### Mobile cleanup

- **`Roster.tsx` is orphaned and broken** — imports `Player` and `League` from api modules that no longer export them, and is registered in no navigator. The team → roster drill-down does not exist in the app.
- **Delete `src/firebaseConfig.js`.** It is a leftover from an unrelated project (`locktalk-96ef5`), references `AsyncStorage` and `getFirestore` without importing them, and would crash if anything imported it. Drop the `firebase` dependency with it — you have Spring Security + JWT, and running two auth systems is a liability, not a backup.
- **Remove `resend` from mobile dependencies and `RESEND_API_KEY` from `mobile/.env.local`.** Email sending already lives on the backend, where it belongs. A server API key in an Expo bundle is a shipped secret. (`.env.local` is correctly gitignored — this is about the bundle, not the repo.)
- **Type the navigators properly.** `RootStackParamList` is one flat type while navigation is nested drawer → stack, which is why `navigate('MyLeagues')` fails typecheck. Declare a ParamList per navigator and compose them.
- **One theme file.** `src/ui/theme.ts` and `src/lib/theme.ts` both exist and are both imported. Merge them. Also: `darkModeSlice` exists while `app.json` pins `userInterfaceStyle: "light"` — pick one and honor it.
- Replace placeholders: `Findleagues` renders `Test1…Test5`, `LeaguesScreen` hardcodes `"Welcome Sahd Khan"`, `Home` is an empty view.
- Delete the commented-out Tabs navigator and commented API imports in `MainAppStack`, `Teams`, `Roster`.

---

## Phase 1 — Domain foundation (~2 weeks) ✅ done

The migration that makes everything after it possible. Shipped in three commits
(`71987c6`, `0bc97f2`, `9228df5`): V3/V4 migrations, `LeagueAccessService`, season and
invite-code endpoints, the roster-entry rework of team/player, and the matching mobile
screens (season switcher, join-by-code, invite sharing). Verified end to end against a
live Postgres instance; the automated Testcontainers suite covers the same ground for CI.

Not carried over from the original sketch below: `team.season_id` — teams stayed
league-scoped with `roster_entry` carrying the season, which was the noted fallback and
turned out simpler in practice. `created_at`/`updated_at` landed on the new tables
(season, player, roster_entry, league_invite) but weren't retrofitted onto the
pre-existing ones (league, team, league_member, user, sport) — the migration adds the
columns, but wiring them into the JPA entities is still open.

### `V2__seasons_and_rosters.sql`

```
season(id, league_id, name, starts_on, ends_on, is_active)
player(id, league_id, first_name, last_name, user_id NULL, photo_url NULL, birthdate NULL)
    -- league-scoped person, no longer bolted to one team
roster_entry(id, season_id, team_id, player_id, jersey_number, position)
    -- UNIQUE(season_id, team_id, player_id), UNIQUE(season_id, team_id, jersey_number)
team: + season_id (or keep league-scoped and let roster_entry carry the season)
league: + slug UNIQUE, logo_url, primary_color, settings JSONB
league_invite(id, league_id, code UNIQUE, role, expires_at, max_uses, uses)
```

Plus `created_at` / `updated_at` on every table — you will want them and they are painful to backfill.

### Roles

`OWNER, ADMIN, TEAM_MANAGER, SCOREKEEPER, MEMBER, SPECTATOR`. `TEAM_MANAGER` needs a
team scope (`league_member.team_id NULL`), `SCOREKEEPER` needs a per-game assignment.
Pull authorization out of `LeagueService`/`TeamService` into one `LeagueAccessService` —
it is already duplicated across two classes and will be duplicated across six.

### Joining a league — invite codes, not discovery

**Replace `Findleagues` with join-by-code.** A public browse directory is the wrong first
move: it needs moderation, spam handling, and search relevance, and nobody joins a rec
league they found by browsing. A shareable 6-character code or deep link (`leagueManager://join/ABC123`)
is one screen, ships in a day, and is how leagues actually spread. Public discovery can
come much later, if ever.

### Mobile

Resurrect `Roster.tsx` and wire it into the Leagues stack. Season switcher. League
settings screen (name, sport, logo, colors, period format). Join-by-code screen.

---

## Phase 2 — Games & scheduling (~2 weeks)

```
game(id, season_id, home_team_id, away_team_id, scheduled_at, venue TEXT,
     status ENUM(SCHEDULED, LIVE, FINAL, CANCELLED, FORFEIT),
     home_score, away_score, period_count, period_length_minutes)
```

Keep `venue` a plain text field for now — a venue table with addresses and availability
is a Phase 6+ problem.

- `GET/POST/PUT/DELETE /api/seasons/{id}/games`, filtered by team and date range.
- A round-robin schedule generator is the highest-value convenience feature here: pick teams, weeks, and days, get a full season.
- Mobile: schedule list (upcoming / past), game detail, create & edit game.

---

## Phase 3 — Live scoring & stats (~3 weeks) ← **the core loop**

This is the product. Everything before it is setup; everything after it is distribution.

### Model stats as events, not columns

```
game_event(id, client_id UUID UNIQUE, game_id, team_id, player_id NULL,
           type, period, clock_seconds, value, created_by, created_at)
player_game_stat(game_id, player_id, stats JSONB)   -- derived rollup
sport_stat_type(sport_id, key, label, abbrev, aggregation)  -- catalog per sport
```

**Why event-sourced:** you get undo, play-by-play, and full recomputation for free, and
`client_id` makes the sync endpoint idempotent — which is what makes offline entry work.
Gym wifi is bad. The scorekeeper app must queue events locally and flush a batch to
`POST /api/games/{id}/events` on reconnect, and that batch has to be safe to retry.

**Why JSONB rollups + a stat catalog** instead of typed basketball columns: the pitch is a
*generic* league manager. A `sport_stat_type` catalog plus a JSONB stat line means adding
soccer or volleyball is seed data, not a schema migration and a second aggregation
pipeline. Postgres handles JSONB aggregation fine at this scale, and you can promote hot
basketball fields to generated columns later if queries need it.

_Fallback if you want to move faster:_ typed basketball columns now, migrate later. It is
genuinely simpler — but you will pay for it the first time a non-basketball league signs up,
and "generic" is the whole differentiator.

### Ship the basketball stat set first

`PTS, FGM, FGA, 3PM, 3PA, FTM, FTA, OREB, DREB, AST, STL, BLK, TOV, PF, MIN`.
Derive `REB`, `FG%`, `3P%`, `FT%`, `EFF`.

### Deliverables

- Scorekeeper screen: tap a player, tap an action, score updates. Optimistic, undoable, offline-queued.
- Box score view (per team, per game).
- Standings computed from `FINAL` games: W-L, PCT, GB, PF/PA, streak, head-to-head tiebreak.
- League leaders per stat.
- Player career view aggregated across seasons — this is what the season model in Phase 1 bought you.

---

## Phase 4 — Media & identity (~1.5 weeks)

Build **one** presigned-upload service and reuse it everywhere. Cloudflare R2 (zero egress
fees) or S3. `media(id, owner_type, owner_id, url, mime, bytes, uploaded_by)`.

Order of use: user avatar (finishes the `TODO: ADD IMAGE UPLOAD` in the drawer) → team logo
→ league logo + colors driving app theming → game photos.

**Defer video entirely.** Storage, transcoding, and bandwidth for highlight reels is a
month of work and a real monthly bill. Revisit with Mux once leagues are paying.

---

## Phase 5 — Public league pages (~2 weeks)

Add `web/` to the monorepo: **Next.js**, server-rendered, hitting a read-only
`/api/public/leagues/{slug}/**` endpoint set that requires no auth.

Standings, schedule, box scores, leaders, roster pages. Dynamic OG images so a shared
standings link renders a card in iMessage and group chats — that is the actual growth
mechanism for a league app. This is also where the missing CORS bean from Phase 0 stops
being theoretical.

---

## Phase 6 — Engagement (~1.5 weeks)

- **Expo push notifications**: game reminder (24h / 1h), final score, roster invite, schedule change. `device_token` table + per-user notification preferences.
- League announcements / news feed.
- Game recaps attached to a finished game.

Notifications are the retention hook. A league app people open twice a week beats one they open twice a season.

---

## Phase 7 — Ship it (ongoing, start during Phase 3)

- Backend `Dockerfile` (only a Postgres compose exists today) → deploy to **Fly.io** or **Render**, managed Postgres, Flyway on boot.
- Move `application-local.yml` values to environment variables in production.
- **EAS Build** config → TestFlight + Play internal testing.
- Sentry on both client and server; structured JSON logging.
- Add a `mobile/.env.example` — there is none.

---

## Phase 8 — Monetization (only after real leagues are using it)

Do not build billing before there are people to bill. A Stripe payment link and a manually
flipped `plan` column is completely fine for the first ten customers.

When it is time, the natural gate is: **Free** = 1 league, 1 active season, basic stats.
**Paid** = multiple leagues, media storage, custom branding, public page with a custom
domain, CSV/PDF export. Enforce with an `entitlement` check in the service layer, not
scattered through controllers.

---

## Suggested changes to the original plan

1. **Ship basketball deep, not five sports wide.** The schema stays generic; the stat catalog and UI ship basketball-only first. A shallow multi-sport app loses to a great basketball app.
2. **Cut Firebase.** It is currently a dead dependency pointing at an unrelated project. You already have JWT auth that works.
3. **Add seasons** — missing from the original plan and the most expensive thing to retrofit.
4. **Split `player` from `roster_entry`.** "Track player performance over time" requires a person who persists across teams and seasons.
5. **Invite codes over league discovery.**
6. **Defer video** to after monetization.
7. **Event-sourced, offline-first stat entry is the moat.** Every competitor's weak point is a scorekeeper in a gym with no signal.
8. **Add RTK Query** (you already have Redux Toolkit). The current `await dispatch(create); await load();` refetch pattern is hand-rolled cache invalidation and will get worse with every entity added.

---

## Commit log

Phase 0 (stabilize):

1. `a587552` — fix(security): remove /auth/users, enforce membership on team reads, whitelist admin roles
2. `e62bc8c` — test(backend): re-enable tests, add Testcontainers integration suite and CI
3. `ee8d7e9` — chore(mobile): drop dead firebase/resend deps, fix nav typing, resurrect Roster
4. `5098e63` — docs: add development roadmap

Phase 1 (domain foundation):

5. `71987c6` — feat(backend): seasons, league-scoped rosters, and invite codes
6. `0bc97f2` — test(backend): cover seasons, rosters, and invite codes
7. `9228df5` — feat(mobile): wire the app to seasons, rosters, and invite-code joining

## Next up: Phase 2 — Games & scheduling

The `game` table, round-robin schedule generator, and schedule/game-detail screens
described above. Nothing in Phase 2 is blocked — the season model it needs is in place.
