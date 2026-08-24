import { Player, Team } from '../../types';
import { api } from './client';

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
		method: 'POST',
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
 * Add a new player to the league and place them on this team's roster for
 * the league's active season, in one step.
 * @param teamId - The ID of the team.
 * @param firstName - The player's first name.
 * @param lastName - The player's last name.
 * @param jerseyNumber - Optional jersey number, unique per team per season.
 * @param position - Optional position label.
 * @returns A promise that resolves to the created roster entry.
 */
export async function addPlayer(
	teamId: string,
	firstName: string,
	lastName: string,
	jerseyNumber?: number,
	position?: string,
): Promise<Player> {
	return api<Player>(`/teams/${teamId}/players`, {
		method: 'POST',
		body: JSON.stringify({ firstName, lastName, jerseyNumber, position }),
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
		method: 'DELETE',
	});
}

/**
 * Delete a team.
 * @param teamId - The ID of the team.
 * @returns A promise that resolves when the team is deleted.
 */
export async function deleteTeam(teamId: string): Promise<void> {
	return api<void>(`/teams/${teamId}`, {
		method: 'DELETE',
	});
}
