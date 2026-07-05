import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Team, TeamState } from '../../../types';
import { RootState } from '../store';
import { createTeam, deleteTeam, getTeams } from '../../api/teams';

export const fetchTeamsForLeague = createAsyncThunk<
	Team[] | null,
	{ leagueId: string },
	{ state: RootState; rejectValue: string }
>('leagues/fetchTeamsForLeague', async ({ leagueId }, thunkAPI) => {
	try {
		if (leagueId) {
			const data = await getTeams(leagueId);
			return data;
		}
		return null;
	} catch (error: any) {
		return thunkAPI.rejectWithValue(error.message || 'Failed to fetch teams');
	}
});

export const createTeamForLeague = createAsyncThunk<
	Team,
	{ leagueId: string; name: string },
	{ state: RootState; rejectValue: string }
>('leagues/createTeamForLeague', async ({ leagueId, name }, thunkAPI) => {
	try {
		if (leagueId && name) {
			const data = await createTeam(leagueId, name);
			return data;
		}
		throw new Error('Invalid team data');
	} catch (error: any) {
		return thunkAPI.rejectWithValue(error.message || 'Failed to create team');
	}
});

export const removeTeamFromLeague = createAsyncThunk<
	void,
	{ leagueId: string; teamId: string },
	{ state: RootState; rejectValue: string }
>('leagues/removeTeamFromLeague', async ({ leagueId, teamId }, thunkAPI) => {
	try {
		if (leagueId && teamId) {
			await deleteTeam(teamId);
			return;
		}
		throw new Error('Invalid team data');
	} catch (error: any) {
		return thunkAPI.rejectWithValue(error.message || 'Failed to remove team');
	}
});

const initialState: TeamState = {
	teams: null,
	selectedTeam: null,
	loading: false,
	error: null,
};

const teamsSlice = createSlice({
	name: 'teams',
	initialState,
	reducers: {
		setSelectedTeam: (state, action: PayloadAction<Team | null>) => {
			state.selectedTeam = action.payload;
		},
		clearSelectedTeam: (state) => {
			state.selectedTeam = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchTeamsForLeague.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchTeamsForLeague.fulfilled, (state, action) => {
				state.loading = false;
				state.teams = action.payload;
			})
			.addCase(fetchTeamsForLeague.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || 'Failed to fetch teams';
			})
			.addCase(createTeamForLeague.fulfilled, (state, action) => {
				state.loading = false;
				if (state.teams) {
					state.teams.push(action.payload);
				}
			})
			.addCase(createTeamForLeague.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || 'Failed to create team';
			})
			.addCase(removeTeamFromLeague.fulfilled, (state, action) => {
				state.loading = false;
				if (state.teams) {
					state.teams = state.teams.filter((t) => t.id !== action.meta.arg.teamId);
				}
			})
			.addCase(removeTeamFromLeague.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || 'Failed to remove team';
			});
	},
});

export const { setSelectedTeam, clearSelectedTeam } = teamsSlice.actions;
export default teamsSlice.reducer;
