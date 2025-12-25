import { api } from "./client";

export type Team = {
  id: string;
  name: string;
};

export type Player = {
  id: string;
  name: string;
};

export async function getTeams(leagueId: string): Promise<Team[]> {
  return api<Team[]>(`/teams/league/${leagueId}`);
}

export async function createTeam(leagueId: string, name: string): Promise<Team> {
  return api<Team>(`/teams/league/${leagueId}`, {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export async function getPlayers(teamId: string): Promise<Player[]> {
  return api<Player[]>(`/teams/${teamId}/players`);
}

export async function addPlayer(teamId: string, name: string): Promise<Player> {
  return api<Player>(`/teams/${teamId}/players`, {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}
