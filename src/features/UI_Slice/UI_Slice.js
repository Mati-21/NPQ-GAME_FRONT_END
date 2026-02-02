import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeTab: "none",
  onlineUsers: [],
  NotificationModal: false,
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
    openNotificationModal: (state) => {
      state.NotificationModal = true;
    },
    closeNotificationModal: (state) => {
      state.NotificationModal = false;
    },
    toggleNotificationModal: (state) => {
      state.NotificationModal = !state.NotificationModal;
    },
  },
});

export const {
  setActiveTab,
  resetActiveTab,
  setOnlineUsers,
  clearOnlineUsers,
  openNotificationModal,
  closeNotificationModal,
  toggleNotificationModal,
} = UI_Slice.actions;

export default UI_Slice.reducer;
