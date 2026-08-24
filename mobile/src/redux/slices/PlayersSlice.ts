import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Player, PlayerState } from '../../../types';
import { RootState } from '../store';
import { addPlayer, getPlayers, removePlayer } from '../../api/teams';

export const fetchPlayersForTeam = createAsyncThunk<
	Player[] | null,
	{ teamId: string },
	{ state: RootState; rejectValue: string }
>('teams/fetchPlayersForTeam', async ({ teamId }, thunkAPI) => {
	try {
		if (teamId) {
			const data = await getPlayers(teamId);
			return data;
		}
		return null;
	} catch (error: any) {
		return thunkAPI.rejectWithValue(error.message || 'Failed to fetch players');
	}
});

export const addPlayerToTeam = createAsyncThunk<
	Player,
	{ teamId: string; name: string },
	{ state: RootState; rejectValue: string }
>('teams/addPlayerToTeam', async ({ teamId, name }, thunkAPI) => {
	try {
		if (teamId && name) {
			const data = await addPlayer(teamId, name);
			return data;
		}
		throw new Error('Invalid player data');
	} catch (error: any) {
		return thunkAPI.rejectWithValue(error.message || 'Failed to add player');
	}
});

export const removePlayerFromTeam = createAsyncThunk<
	void,
	{ teamId: string; playerId: string },
	{ state: RootState; rejectValue: string }
>('teams/removePlayerFromTeam', async ({ teamId, playerId }, thunkAPI) => {
	try {
		if (teamId && playerId) {
			await removePlayer(teamId, playerId);
			return;
		}
		throw new Error('Invalid player data');
	} catch (error: any) {
		return thunkAPI.rejectWithValue(error.message || 'Failed to remove player');
	}
});

const initialState: PlayerState = {
	players: null,
	loading: false,
	error: null,
};

const playersSlice = createSlice({
	name: 'players',
	initialState,
	reducers: {
		clearPlayers: (state) => {
			state.players = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchPlayersForTeam.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchPlayersForTeam.fulfilled, (state, action) => {
				state.loading = false;
				state.players = action.payload;
			})
			.addCase(fetchPlayersForTeam.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || 'Failed to fetch players';
			})
			.addCase(addPlayerToTeam.fulfilled, (state, action) => {
				state.loading = false;
				if (state.players) {
					state.players.push(action.payload);
				}
			})
			.addCase(addPlayerToTeam.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || 'Failed to add player';
			})
			.addCase(removePlayerFromTeam.fulfilled, (state, action) => {
				state.loading = false;
				if (state.players) {
					state.players = state.players.filter((p) => p.id !== action.meta.arg.playerId);
				}
			})
			.addCase(removePlayerFromTeam.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || 'Failed to remove player';
			});
	},
});

export const { clearPlayers } = playersSlice.actions;
export default playersSlice.reducer;
