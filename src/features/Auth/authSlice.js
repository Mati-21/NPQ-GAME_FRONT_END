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

    addFriendRequest: (state, action) => {
      state.user.friendRequests.received = [
        ...state.user.friendRequests.received,
        action.payload,
      ];
    },
    addFriend: (state, action) => {
      state.user.friends = [...state.user.friends, action.payload];
    },

    Unfriend: (state, action) => {
      const removeId = action.payload;
      console.log(removeId);
      const arrayOFIds = state.user.friends;
      const newFriends = arrayOFIds.filter((id) => id !== removeId);

      state.user.friends = [...newFriends];
    },

    logout: (state) => {
      state.user = null;

      state.isAuthenticated = false;
    },
  },
});

export const {
  setCredentials,
  setError,
  clearError,
  logout,
  addFriend,
  Unfriend,
  addFriendRequest,
} = authSlice.actions;
export default authSlice.reducer;
