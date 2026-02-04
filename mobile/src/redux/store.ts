import { configureStore } from '@reduxjs/toolkit';
import darkModeReducer from './slices/darkModeSlice';

export const store = configureStore({
  reducer: {
    darkMode: darkModeReducer,
  },
});