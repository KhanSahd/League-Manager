import { api } from "./client";

/**
 * Team and Player types
 */
export type Team = {
  id: string;
  name: string;
};

/**
 * Player type
 */
export type Player = {
  id: string;
  name: string;
};

/**
 * Retrieve teams for a specific league.
 * @param leagueId - The ID of the league.
 * @returns A promise that resolves to an array of teams.
 */
export async function getTeams(leagueId: string): Promise<Team[]> {
  return api<Team[]>(`/teams/league/${leagueId}`);
}

/**
 * Create a new team in a specific league.
 * @param leagueId - The ID of the league.
 * @param name - The name of the team.
 * @returns A promise that resolves to the created team.
 */
export async function createTeam(leagueId: string, name: string): Promise<Team> {
  return api<Team>(`/teams/league/${leagueId}`, {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

/**
 * Retrieve players for a specific team.
 * @param teamId - The ID of the team.
 * @returns A promise that resolves to an array of players.
 */
export async function getPlayers(teamId: string): Promise<Player[]> {
  return api<Player[]>(`/teams/${teamId}/players`);
}

/**
 * Add a new player to a specific team.
 * @param teamId - The ID of the team.
 * @param name - The name of the player.
 * @returns A promise that resolves to the created player.
 */
export async function addPlayer(teamId: string, name: string): Promise<Player> {
  return api<Player>(`/teams/${teamId}/players`, {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

/**
 * Delete a player from a specific team.
 * @param teamId - The ID of the team.
 * @param playerId - The ID of the player.
 * @returns A promise that resolves when the player is deleted.
 */
export async function removePlayer(teamId: string, playerId: string): Promise<void> {
  return api<void>(`/teams/${teamId}/players/${playerId}`, {
    method: "DELETE",
  });
}

/**
 * Delete a team.
 * @param teamId - The ID of the team.
 * @returns A promise that resolves when the team is deleted.
 */
export async function deleteTeam(teamId: string): Promise<void> {
  return api<void>(`/teams/${teamId}`, {
    method: "DELETE",
  });
}
