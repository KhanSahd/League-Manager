import { configureStore } from '@reduxjs/toolkit';
import darkModeReducer from './slices/darkModeSlice';
import authReducer from './slices/AuthSlice';

export const store = configureStore({
  reducer: {
    darkMode: darkModeReducer,
    auth: authReducer
  },
});

// Infer the `RootState` type from the store itself
export type RootState = ReturnType<typeof store.getState>

// Infer the `AppDispatch` type as well while you are here
export type AppDispatch = typeof store.dispatch