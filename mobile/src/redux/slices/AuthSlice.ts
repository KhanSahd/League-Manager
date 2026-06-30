import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type User = {
    id: string;
    firstName: string,
    lastName: string,
    email: string;
}

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
};

const initialState: AuthState = {
    user: null,
    token: null,
    loading: false,
    error: null
}

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