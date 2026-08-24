import { Season } from '../../types';
import { api } from './client';

/**
 * Retrieve every season for a league, most recent first.
 * @param leagueId - The ID of the league.
 */
export async function getSeasons(leagueId: string): Promise<Season[]> {
	return api<Season[]>(`/leagues/${leagueId}/seasons`);
}

/**
 * Retrieve the league's currently active season.
 * @param leagueId - The ID of the league.
 */
export async function getActiveSeason(leagueId: string): Promise<Season> {
	return api<Season>(`/leagues/${leagueId}/seasons/active`);
}

/**
 * Start a new season for a league.
 * @param leagueId - The ID of the league.
 * @param name - The season's name (e.g. "Fall 2026").
 * @param activate - Whether this season should become the active one immediately.
 */
export async function createSeason(
	leagueId: string,
	name: string,
	activate: boolean,
): Promise<Season> {
	return api<Season>(`/leagues/${leagueId}/seasons`, {
		method: 'POST',
		body: JSON.stringify({ name, activate }),
	});
}

/**
 * Make an existing season the active one, deactivating the current one.
 * @param seasonId - The ID of the season to activate.
 */
export async function activateSeason(seasonId: string): Promise<Season> {
	return api<Season>(`/seasons/${seasonId}/activate`, {
		method: 'PUT',
	});
}
