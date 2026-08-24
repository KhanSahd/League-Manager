import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Season, SeasonState } from '../../../types';
import { RootState } from '../store';
import { activateSeason, createSeason, getSeasons } from '../../api/seasons';

export const fetchSeasonsForLeague = createAsyncThunk<
	Season[],
	{ leagueId: string },
	{ state: RootState; rejectValue: string }
>('seasons/fetchSeasonsForLeague', async ({ leagueId }, thunkAPI) => {
	try {
		return await getSeasons(leagueId);
	} catch (error: any) {
		return thunkAPI.rejectWithValue(error.message || 'Failed to fetch seasons');
	}
});

export const createSeasonForLeague = createAsyncThunk<
	Season,
	{ leagueId: string; name: string; activate: boolean },
	{ state: RootState; rejectValue: string }
>('seasons/createSeasonForLeague', async ({ leagueId, name, activate }, thunkAPI) => {
	try {
		return await createSeason(leagueId, name, activate);
	} catch (error: any) {
		return thunkAPI.rejectWithValue(error.message || 'Failed to create season');
	}
});

export const activateSeasonById = createAsyncThunk<
	Season,
	{ seasonId: string },
	{ state: RootState; rejectValue: string }
>('seasons/activateSeasonById', async ({ seasonId }, thunkAPI) => {
	try {
		return await activateSeason(seasonId);
	} catch (error: any) {
		return thunkAPI.rejectWithValue(error.message || 'Failed to activate season');
	}
});

const initialState: SeasonState = {
	seasons: null,
	activeSeason: null,
	loading: false,
	error: null,
};

function updateActive(state: SeasonState) {
	state.activeSeason = state.seasons?.find((s) => s.active) ?? null;
}

const seasonsSlice = createSlice({
	name: 'seasons',
	initialState,
	reducers: {
		clearSeasons: (state) => {
			state.seasons = null;
			state.activeSeason = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchSeasonsForLeague.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchSeasonsForLeague.fulfilled, (state, action) => {
				state.loading = false;
				state.seasons = action.payload;
				updateActive(state);
			})
			.addCase(fetchSeasonsForLeague.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || 'Failed to fetch seasons';
			})
			.addCase(createSeasonForLeague.fulfilled, (state, action) => {
				state.loading = false;
				if (state.seasons) {
					if (action.payload.active) {
						state.seasons = state.seasons.map((s) => ({ ...s, active: false }));
					}
					state.seasons.unshift(action.payload);
					updateActive(state);
				}
			})
			.addCase(createSeasonForLeague.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || 'Failed to create season';
			})
			.addCase(activateSeasonById.fulfilled, (state, action) => {
				state.loading = false;
				if (state.seasons) {
					state.seasons = state.seasons.map((s) => ({
						...s,
						active: s.id === action.payload.id,
					}));
					updateActive(state);
				}
			})
			.addCase(activateSeasonById.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || 'Failed to activate season';
			});
	},
});

export const { clearSeasons } = seasonsSlice.actions;
export default seasonsSlice.reducer;
