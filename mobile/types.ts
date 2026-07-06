// Root Stack Parameter List
export type RootStackParamList = {
	Login: undefined;
	Register: undefined;
	'Forgot-Password': undefined;
	HomeScreen: undefined;
	Teams: { leagueId: string };
	Roster: { teamId: string };
	'Join Leagues': undefined;
	MyLeagues: undefined;
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
