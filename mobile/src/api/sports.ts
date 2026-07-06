import { Sport } from 'types';
import { api } from './client';

export async function getAllSports(): Promise<Sport[]> {
	return api<Sport[]>('/sports/all');
}
