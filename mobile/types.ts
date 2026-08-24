import { NavigatorScreenParams } from '@react-navigation/native';

// Navigator parameter lists, one per navigator, composed the same way the
// navigators themselves are nested (Drawer > Leagues stack).
export type AuthStackParamList = {
	Welcome: undefined;
	Login: undefined;
	Register: undefined;
	'Forgot-Password': undefined;
};

export type LeaguesStackParamList = {
	Leagues: undefined;
	'Join Leagues': undefined;
	MyLeagues: undefined;
	Teams: { leagueId: string };
	Roster: { teamId: string; teamName?: string };
};

export type DrawerParamList = {
	HomeScreen: undefined;
	LeaguesScreen: NavigatorScreenParams<LeaguesStackParamList> | undefined;
};

// Redux initial States
export type AuthState = {
	user: User | null;
	token: string | null;
	loading: boolean;
	ready: boolean;
	error: string | null;
};

export type LeagueState = {
	leagues: League[] | null;
	selectedLeague: League | null;
	// editingLeague: League | null;
	loading: boolean;
	error: string | null;
};

export type TeamState = {
	teams: Team[] | null;
	selectedTeam: Team | null;
	loading: boolean;
	error: string | null;
};

export type PlayerState = {
	players: Player[] | null;
	loading: boolean;
	error: string | null;
};

export type SeasonState = {
	seasons: Season[] | null;
	activeSeason: Season | null;
	loading: boolean;
	error: string | null;
};

export type SportsState = {
	sports: Sport[] | null;
	selectedSport: Sport | null;
	loading: boolean;
	error: string | null;
};

// API Response Types
export type AuthResponse = {
	token: string;
};

export type User = {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
};

export type LeagueRole = 'OWNER' | 'ADMIN' | 'TEAM_MANAGER' | 'SCOREKEEPER' | 'MEMBER' | 'SPECTATOR';

export type League = {
	id: string;
	name: string;
	slug: string;
	sport: Sport;
	role: LeagueRole;
};

export type UpdateLeagueRequest = {
	id: string;
	name: string;
	sport: Sport;
};

export type Team = {
	id: string;
	name: string;
};

// A player as placed on a team's roster for the league's active season.
export type Player = {
	playerId: string;
	firstName: string;
	lastName: string;
	jerseyNumber: number | null;
	position: string | null;
};

export type Sport = {
	id: string;
	name: string;
};

export type Season = {
	id: string;
	name: string;
	startsOn: string | null;
	endsOn: string | null;
	active: boolean;
};

export type LeagueInvite = {
	id: string;
	code: string;
	role: LeagueRole;
	expiresAt: string | null;
	maxUses: number | null;
	uses: number;
	teamId: string | null;
};

export type RedeemInviteResult = {
	leagueId: string;
	leagueName: string;
	role: LeagueRole;
};
