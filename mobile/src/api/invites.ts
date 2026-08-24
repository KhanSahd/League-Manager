import { LeagueInvite, LeagueRole, RedeemInviteResult } from '../../types';
import { api } from './client';

/**
 * Create a shareable invite code for a league.
 * @param leagueId - The ID of the league.
 * @param role - The role a redeemer gets.
 * @param expiresInHours - Optional expiry, in hours from now.
 * @param maxUses - Optional cap on how many times the code can be redeemed.
 * @param teamId - For TEAM_MANAGER invites, the team the resulting membership is scoped to.
 */
export async function createInvite(
	leagueId: string,
	role: LeagueRole,
	expiresInHours?: number,
	maxUses?: number,
	teamId?: string,
): Promise<LeagueInvite> {
	return api<LeagueInvite>(`/leagues/${leagueId}/invites`, {
		method: 'POST',
		body: JSON.stringify({ role, expiresInHours, maxUses, teamId }),
	});
}

/**
 * List a league's outstanding invite codes.
 * @param leagueId - The ID of the league.
 */
export async function getInvites(leagueId: string): Promise<LeagueInvite[]> {
	return api<LeagueInvite[]>(`/leagues/${leagueId}/invites`);
}

/**
 * Redeem an invite code, joining its league with the code's role.
 * @param code - The invite code.
 */
export async function redeemInvite(code: string): Promise<RedeemInviteResult> {
	return api<RedeemInviteResult>('/invites/redeem', {
		method: 'POST',
		body: JSON.stringify({ code }),
	});
}
