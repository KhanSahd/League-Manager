import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Sport, SportsState } from 'types';
import { getAllSports } from '../../api/sports';

const initialState: SportsState = {
	sports: null,
	selectedSport: null,
	loading: false,
	error: null,
};

export const getSports = createAsyncThunk<Sport[] | null, void, { rejectValue: string }>(
	'sports/getSports',
	async (_, thunkAPI) => {
		try {
			const data = await getAllSports();
			return data;
		} catch (error: any) {
			return thunkAPI.rejectWithValue(error.message ?? 'Failed to fetch sports');
		}
	},
);

const sportsSlice = createSlice({
	name: 'sports',
	initialState,
	reducers: {
		setSelectedSport: (state, action) => {
			state.selectedSport = action.payload;
			console.log(state.selectedSport);
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getSports.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(getSports.fulfilled, (state, action) => {
				state.loading = false;
				state.sports = action.payload;
			})
			.addCase(getSports.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});
	},
});

export const { setSelectedSport } = sportsSlice.actions;
export default sportsSlice.reducer;
