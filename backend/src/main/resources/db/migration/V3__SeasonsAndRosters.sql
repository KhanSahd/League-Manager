-- Timestamps on existing tables.
ALTER TABLE users ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE users ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE sport ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE sport ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE league ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE league ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE team ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE team ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE league_member ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE league_member ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE reset_token ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- League branding/config, addressed by a stable slug for public pages later.
ALTER TABLE league ADD COLUMN slug VARCHAR(255);
ALTER TABLE league ADD COLUMN logo_url VARCHAR(1024);
ALTER TABLE league ADD COLUMN primary_color VARCHAR(7);
ALTER TABLE league ADD COLUMN settings JSONB NOT NULL DEFAULT '{}'::jsonb;

UPDATE league
SET slug = lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substr(id::text, 1, 8)
WHERE slug IS NULL;

ALTER TABLE league ALTER COLUMN slug SET NOT NULL;
ALTER TABLE league ADD CONSTRAINT uk_league_slug UNIQUE (slug);

-- League members can be scoped to a single team (TEAM_MANAGER); NULL means league-wide.
ALTER TABLE league_member ADD COLUMN team_id UUID REFERENCES team(id);

-- Seasons: a league runs many, one at a time is active.
CREATE TABLE season (
    id UUID PRIMARY KEY,
    league_id UUID NOT NULL REFERENCES league(id),
    name VARCHAR(255) NOT NULL,
    starts_on DATE,
    ends_on DATE,
    is_active BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX uk_season_one_active_per_league ON season (league_id) WHERE is_active;

-- Every existing league gets a first season so existing rosters have somewhere to attach.
INSERT INTO season (id, league_id, name, is_active)
SELECT gen_random_uuid(), id, 'Season 1', true FROM league;

-- Player becomes a league-scoped person instead of belonging to a single team.
ALTER TABLE player RENAME TO player_old;

CREATE TABLE player (
    id UUID PRIMARY KEY,
    league_id UUID NOT NULL REFERENCES league(id),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    user_id UUID REFERENCES users(id),
    photo_url VARCHAR(1024),
    birthdate DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- A roster_entry is what actually places a player on a team for a given season.
CREATE TABLE roster_entry (
    id UUID PRIMARY KEY,
    season_id UUID NOT NULL REFERENCES season(id),
    team_id UUID NOT NULL REFERENCES team(id),
    player_id UUID NOT NULL REFERENCES player(id),
    jersey_number INT,
    position VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uk_roster_entry_season_team_player UNIQUE (season_id, team_id, player_id)
);

CREATE UNIQUE INDEX uk_roster_entry_season_team_jersey
    ON roster_entry (season_id, team_id, jersey_number)
    WHERE jersey_number IS NOT NULL;

-- Backfill: every old player row becomes a league-scoped player plus a roster
-- entry on its team in that league's new first season. Reusing the old id
-- keeps the mapping obvious without a temp lookup table.
INSERT INTO player (id, league_id, first_name, last_name, created_at, updated_at)
SELECT
    po.id,
    t.league_id,
    split_part(po.name, ' ', 1),
    CASE WHEN strpos(po.name, ' ') > 0
         THEN substr(po.name, strpos(po.name, ' ') + 1)
         ELSE ''
    END,
    now(),
    now()
FROM player_old po
JOIN team t ON po.team_id = t.id;

INSERT INTO roster_entry (id, season_id, team_id, player_id)
SELECT gen_random_uuid(), s.id, po.team_id, po.id
FROM player_old po
JOIN team t ON po.team_id = t.id
JOIN season s ON s.league_id = t.league_id AND s.is_active = true;

DROP TABLE player_old;

-- Invite codes: how a user actually joins a league.
CREATE TABLE league_invite (
    id UUID PRIMARY KEY,
    league_id UUID NOT NULL REFERENCES league(id),
    code VARCHAR(16) NOT NULL,
    role VARCHAR(50) NOT NULL,
    expires_at TIMESTAMPTZ,
    max_uses INT,
    uses INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uk_league_invite_code UNIQUE (code)
);
