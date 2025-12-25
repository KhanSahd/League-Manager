import { api } from "./client";

export type League = {
  id: string;
  name: string;
  sport: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
};

export async function getMyLeagues(): Promise<League[]> {
  return api<League[]>("/leagues/mine");
}

export async function createLeague(name: string, sport: string): Promise<League> {
  return api<League>("/leagues", {
    method: "POST",
    body: JSON.stringify({ name, sport }),
  });
}
