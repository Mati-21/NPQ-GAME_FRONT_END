import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addOneNotification: (state, action) => {
      state.notifications = [...state.notifications, action.payload];
    },
    addNotifications: (state, action) => {
      state.notifications = action.payload;
    },
  },
});

export const { addNotification, addOneNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;
