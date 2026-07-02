import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeTab: "none",
  onlineUsers: [],
  NotificationModal: false,
  isEditProfileOpen: false,
  isQuitGameModalOpen: false,
  gameRequests: [], // incoming game requests
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
    openEditProfile: (state) => {
      state.isEditProfileOpen = true;
    },
    closeEditProfile: (state) => {
      state.isEditProfileOpen = false;
    },
    toggleEditProfile: (state) => {
      state.isEditProfileOpen = !state.isEditProfileOpen;
    },
    openQuitModal: (state) => {
      console.log("Something");
      state.isQuitGameModalOpen = true;
    },
    closeQuitModal: (state) => {
      state.isQuitGameModalOpen = false;
    },
    addGameRequest: (state, action) => {
      // avoid duplicates by requestId
      const exists = state.gameRequests.find(
        (r) => r.requestId === action.payload.requestId
      );
      if (!exists) {
        state.gameRequests.push(action.payload);
      }
    },
    removeGameRequest: (state, action) => {
      state.gameRequests = state.gameRequests.filter(
        (r) => r.requestId !== action.payload
      );
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
  openEditProfile,
  closeEditProfile,
  toggleEditProfile,
  openQuitModal,
  closeQuitModal,
  addGameRequest,
  removeGameRequest,
} = UI_Slice.actions;

export default UI_Slice.reducer;
