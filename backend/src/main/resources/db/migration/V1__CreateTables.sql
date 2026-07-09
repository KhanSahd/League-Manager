CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    password_hash VARCHAR(255) NOT NULL,

    CONSTRAINT uk_users_email UNIQUE (email)
);

CREATE TABLE sport(
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE reset_token(
    id UUID PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    user_id UUID NOT NULL,
    CONSTRAINT fk_reset_token_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE league(
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sport_id UUID NOT NULL,
    CONSTRAINT fk_league_sport FOREIGN KEY (sport_id) REFERENCES sport(id)
);

CREATE TABLE team(
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    league_id UUID NOT NULL,
    CONSTRAINT fk_team_league FOREIGN KEY (league_id) REFERENCES league(id)
);

CREATE TABLE player(
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    team_id UUID NOT NULL,
    CONSTRAINT fk_player_team FOREIGN KEY (team_id) REFERENCES team(id)
);

CREATE TABLE league_member(
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    league_id UUID NOT NULL,
    role VARCHAR(50) NOT NULL,
    CONSTRAINT fk_league_member_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_league_member_league FOREIGN KEY (league_id) REFERENCES league(id),
    CONSTRAINT uk_league_member_user_league UNIQUE (user_id, league_id)
);