import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, User } from "../../../types";
import { api } from "../../api/client";
import * as SecureStore from "expo-secure-store";

const initialState: AuthState = {
    user: null,
    token: null,
    loading: false,
    ready: false,
    error: null
}

export const bootstrapAuth = createAsyncThunk<{ token: string; user: User } | null, void, { rejectValue: string }>(
    "auth/bootstrap",
    async (_, thunkAPI) =>
    {
        try {
            const token = await SecureStore.getItemAsync("token");

            if (!token) return null;

            const user = await api<User>("/me");

            return { token, user };
        } catch (err: any) {
            await SecureStore.deleteItemAsync("token");
            return thunkAPI.rejectWithValue(err.message || "Session expired");
        }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart(state)
        {
            state.loading = true;
            state.error = null;
        },

        setToken(state, action: PayloadAction<string>)
        {
            state.token = action.payload;
        },

        doneLoading(state)
        {
            state.loading = false;
        },

        loginSuccess(state, action: PayloadAction<{ user: User }>)
        {
            state.loading = false;
            state.user = action.payload.user;
            state.error = null;
        },

        loginFailure(state, action: PayloadAction<string>)
        {
            state.loading = false;
            state.error = action.payload;
        },

        logout(state)
        {
            state.user = null;
            state.token = null;
            state.loading = false;
            state.error = null;
        },

        updateUser(state, action: PayloadAction<User>)
        {
            state.user = action.payload;
        },
    },
    extraReducers: (builder) =>
    {
        builder.addCase(bootstrapAuth.pending, (state) => {
            state.ready = false;
        })
        .addCase(bootstrapAuth.fulfilled, (state, action) => {
            state.ready = true;

            if (action.payload) {
                state.token = action.payload.token;
                state.user = action.payload.user;
            }
        })
        .addCase(bootstrapAuth.rejected, (state) => {
            state.ready = true;
            state.token = null;
            state.user = null;
        });
    }
});

export const {
    loginStart,
    setToken,
    doneLoading,
    loginSuccess,
    loginFailure,
    logout,
    updateUser,
} = authSlice.actions;

export default authSlice.reducer;