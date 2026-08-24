-- Lets an invite pre-assign a TEAM_MANAGER to a specific team on redemption.
ALTER TABLE league_invite ADD COLUMN team_id UUID REFERENCES team(id);
