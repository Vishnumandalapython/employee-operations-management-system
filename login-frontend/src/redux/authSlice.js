import {
    createAsyncThunk,
    createSlice
} from "@reduxjs/toolkit";

import api from "../api/api";


// LOGIN ASYNC THUNK
export const loginUser = createAsyncThunk(
    "auth/loginUser",

    async (credentials, { rejectWithValue }) => {

        try {

            const response = await api.post(
                "/login",
                credentials
            );

            return response.data;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                "Login failed"
            );

        }

    }
);


// INITIAL STATE
const initialState = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    isAuthenticated: !!localStorage.getItem("token"),
    loading: false,
    error: null
};

// AUTH SLICE
const authSlice = createSlice({

    name: "auth",

    initialState,

    reducers: {

        logout: (state) => {

            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;

        }

    },


    // ASYNC ACTION HANDLING
    extraReducers: (builder) => {

        builder

            // LOGIN STARTED
            .addCase(loginUser.pending, (state) => {

                state.loading = true;
                state.error = null;

            })


            // LOGIN SUCCESS
            .addCase(loginUser.fulfilled, (state, action) => {

                state.loading = false;

                state.user = action.payload.user;

                state.token = action.payload.token;

                state.isAuthenticated = true;
                 localStorage.setItem(
        "token",
        action.payload.token
    );
    localStorage.setItem(
        "user",
        JSON.stringify(action.payload.user)
    );
})
            // LOGIN FAILED
            .addCase(loginUser.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload;

                state.isAuthenticated = false;

            });

    }

});


export const { logout } = authSlice.actions;

export default authSlice.reducer;