import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../api/client';
import { createLeague, getMyLeagues, updateLeague } from '../../api/league';
import { League, LeagueState, Team, UpdateLeagueRequest } from '../../../types';
import { RootState } from '../store';

export const fetchMyLeagues = createAsyncThunk<League[], void, { rejectValue: string }>(
	'leagues/fetchMyLeagues',
	async (_, thunkAPI) => {
		try {
			const data = await getMyLeagues();
			return data;
		} catch (error: any) {
			return thunkAPI.rejectWithValue(error.message ?? 'Failed to fetch leagues');
		}
	},
);

export const updateLeagueInfo = createAsyncThunk<
	League,
	UpdateLeagueRequest,
	{ rejectValue: string }
>('leagues/updateLeagueInfo', async (leagueData, thunkAPI) => {
	if (leagueData.id) {
		const data = await updateLeague(leagueData.id, leagueData.name, leagueData.sport);
		return data;
	}
	return thunkAPI.rejectWithValue('League not found');
});

// export const fetchTeamsForLeague = createAsyncThunk<Team[] | null, null, {state: RootState} >(
//     "leagues/fetchTeamsForLeague",
//     async ( _, thunkAPI) => {
//         const id = thunkAPI.getState().leagues.selectedLeague?.id;
//         if (id)
//         {
//             const data = await getTeams(id);
//             return data;
//         }
//         return null;
//     }
// )

export const createNewLeague = createAsyncThunk<
	League,
	{ name: string; sport: string },
	{ state: RootState; rejectValue: string }
>('leagues/createLeague', async (leagueData, thunkAPI) => {
	try {
		const data = await createLeague(leagueData.name, leagueData.sport);
		return data;
	} catch (error: any) {
		return thunkAPI.rejectWithValue(error.message ?? 'Failed to create league');
	}
});

const initialState: LeagueState = {
	leagues: null,
	selectedLeague: null,
	// editingLeague: null,
	loading: false,
	error: null,
};

const leaguesSlice = createSlice({
	name: 'leagues',
	initialState,
	reducers: {
		setSelectedLeague(state, action: PayloadAction<League>) {
			state.selectedLeague = action.payload;
		},
		clearSelectedLeague(state) {
			state.selectedLeague = null;
		},
		setSelectedLeagueById(state, action: PayloadAction<League>) {
			state.selectedLeague = state.leagues?.find((l) => l.id === action.payload.id) || null;
		},
		// setEditingLeague(state, action: PayloadAction<League>)
		// {
		//     state.editingLeague = action.payload;
		// },
		// clearEditingLeague(state) {
		//     state.editingLeague = null;
		// }
	},
	extraReducers(builder) {
		builder
			.addCase(fetchMyLeagues.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchMyLeagues.fulfilled, (state, action: PayloadAction<League[]>) => {
				state.loading = false;
				state.leagues = action.payload;
			})
			.addCase(fetchMyLeagues.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload ?? 'Failed to fetch leagues';
			})
			.addCase(updateLeagueInfo.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateLeagueInfo.fulfilled, (state, action: PayloadAction<League>) => {
				state.loading = false;
				state.selectedLeague = null;
				state.leagues =
					state.leagues?.map((l) => (l.id === action.payload.id ? action.payload : l)) || null;
			})
			.addCase(updateLeagueInfo.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload ?? 'Failed to update league';
			})
			.addCase(createNewLeague.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(createNewLeague.fulfilled, (state, action: PayloadAction<League>) => {
				state.loading = false;
				state.leagues = [...(state.leagues || []), action.payload];
			})
			.addCase(createNewLeague.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload ?? 'Failed to create league';
			});
	},
});

export const { setSelectedLeague, clearSelectedLeague, setSelectedLeagueById } =
	leaguesSlice.actions;

export default leaguesSlice.reducer;
