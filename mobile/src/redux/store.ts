import { configureStore } from '@reduxjs/toolkit';
import darkModeReducer from './slices/darkModeSlice';
import authReducer from './slices/AuthSlice';
import leaguesReducer from './slices/leaguesSlice';
import teamsReducer from './slices/TeamsSlice';
import sportsReducer from './slices/SportsSlice';

export const store = configureStore({
	reducer: {
		darkMode: darkModeReducer,
		auth: authReducer,
		leagues: leaguesReducer,
		teams: teamsReducer,
		sports: sportsReducer,
	},
});

// Infer the `RootState` type from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Infer the `AppDispatch` type as well while you are here
export type AppDispatch = typeof store.dispatch;
