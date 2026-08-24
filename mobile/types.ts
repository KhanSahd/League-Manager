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

export type League = {
	id: string;
	name: string;
	sport: Sport;
	role: 'OWNER' | 'ADMIN' | 'MEMBER';
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

export type Player = {
	id: string;
	name: string;
};

export type Sport = {
	id: string;
	name: string;
};
