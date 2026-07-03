import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addOneNotification: (state, action) => {
      // Add new notification to the front of the list
      state.notifications = [action.payload, ...state.notifications];
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    markAllNotificationsRead: (state) => {
      state.notifications = state.notifications.map((n) => ({
        ...n,
        isRead: true,
      }));
    },
    markNotificationRead: (state, action) => {
      state.notifications = state.notifications.map((n) =>
        n._id === action.payload ? { ...n, isRead: true } : n
      );
    },
  },
});

export const {
  addOneNotification,
  setNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} = notificationSlice.actions;

export default notificationSlice.reducer;
