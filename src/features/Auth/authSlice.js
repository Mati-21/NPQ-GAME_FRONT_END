import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  error: "",
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;

      state.isAuthenticated = true;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.error = "";
    },
    logout: (state) => {
      state.user = null;

      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, setError, clearError, logout } =
  authSlice.actions;
export default authSlice.reducer;
