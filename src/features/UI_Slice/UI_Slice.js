import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeTab: "none",
  onlineUsers: [],
};

const UI_Slice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    resetActiveTab: (state) => {
      state.activeTab = "none";
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    clearOnlineUsers: (state) => {
      state.onlineUsers = [];
    },
  },
});

export const {
  setActiveTab,
  resetActiveTab,
  setOnlineUsers,
  clearOnlineUsers,
} = UI_Slice.actions;

export default UI_Slice.reducer;
