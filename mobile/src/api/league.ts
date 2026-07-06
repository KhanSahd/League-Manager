import { League, Sport } from '../../types';
import { api } from './client';

export async function getMyLeagues(): Promise<League[]> {
	return api<League[]>('/leagues/mine');
}

export async function createLeague(name: string, sport: Sport): Promise<League> {
	return api<League>('/leagues', {
		method: 'POST',
		body: JSON.stringify({ name, sportId: sport.id }),
	});
}

export async function updateLeague(id: string, name: string, sport: Sport): Promise<League> {
	return api<League>(`/leagues/${id}`, {
		method: 'PUT',
		body: JSON.stringify({ name, sportId: sport.id }),
	});
}

export async function deleteLeague(id: string): Promise<League> {
	return api<League>(`/leagues/${id}`, {
		method: 'DELETE',
	});
}
