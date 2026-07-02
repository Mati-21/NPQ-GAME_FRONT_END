import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  error: "",
  isAuthenticated: false,
  onlineUsers: [],
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
    setOnlineUsers: (state, action) => {
      console.log(action.payload);
      state.onlineUsers = [...state.onlineUsers, ...action.payload];
    },

    clearError: (state) => {
      state.error = "";
    },

    addFriendRequest: (state, action) => {
      if (!state.user.friendRequests.received.includes(action.payload)) {
        state.user.friendRequests.received = [
          ...state.user.friendRequests.received,
          action.payload,
        ];
      }
    },
    addFriend: (state, action) => {
      const friendId = action.payload;
      if (!state.user.friends.includes(friendId)) {
        state.user.friends.push(friendId);
      }
      state.user.friendRequests.sent = state.user.friendRequests.sent.filter(
        (id) => id !== friendId
      );
      state.user.friendRequests.received = state.user.friendRequests.received.filter(
        (id) => id !== friendId
      );
    },

    Unfriend: (state, action) => {
      const removeId = action.payload;
      console.log(removeId);
      const arrayOFIds = state.user.friends;
      const newFriends = arrayOFIds.filter((id) => id !== removeId);

      state.user.friends = [...newFriends];
    },

    removeSentRequest: (state, action) => {
      const userId = action.payload;
      state.user.friendRequests.sent = state.user.friendRequests.sent.filter(
        (id) => id !== userId
      );
    },

    removeReceivedRequest: (state, action) => {
      const senderId = action.payload;
      state.user.friendRequests.received = state.user.friendRequests.received.filter(
        (id) => id !== senderId
      );
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
  removeSentRequest,
  removeReceivedRequest,
} = authSlice.actions;
export default authSlice.reducer;
