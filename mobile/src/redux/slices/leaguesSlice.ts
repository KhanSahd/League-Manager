import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { createLeague, deleteLeague, getMyLeagues, updateLeague } from '../../api/league';
import { League, LeagueState, Sport, UpdateLeagueRequest } from '../../../types';
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

export const createNewLeague = createAsyncThunk<
	League,
	{ name: string; sport: Sport },
	{ state: RootState; rejectValue: string }
>('leagues/createLeague', async (leagueData, thunkAPI) => {
	try {
		const data = await createLeague(leagueData.name, leagueData.sport);
		console.log(data.name, data.sport);
		return data;
	} catch (error: any) {
		return thunkAPI.rejectWithValue(error.message ?? 'Failed to create league');
	}
});

export const doDeleteLeague = createAsyncThunk<
	League,
	string,
	{ state: RootState; rejectValue: string }
>('leagues/deleteLeague', async (leagueId, thunkAPI) => {
	try {
		const data = await deleteLeague(leagueId);
		return data;
	} catch (error: any) {
		return thunkAPI.rejectWithValue(error.message ?? 'Failed to delete league');
	}
});

const initialState: LeagueState = {
	leagues: null,
	selectedLeague: null,
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
			})
			.addCase(doDeleteLeague.fulfilled, (state, action: PayloadAction<League>) => {
				state.loading = false;
				state.leagues = state.leagues?.filter((l) => l.id !== action.payload.id) || null;
			})
			.addCase(doDeleteLeague.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload ?? 'Failed to delete league';
			});
	},
});

export const { setSelectedLeague, clearSelectedLeague, setSelectedLeagueById } =
	leaguesSlice.actions;

export default leaguesSlice.reducer;
