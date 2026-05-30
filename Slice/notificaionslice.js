import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications:
    localStorage.getItem("notifications") &&
    localStorage.getItem("notifications") !== "undefined"
      ? JSON.parse(localStorage.getItem("notifications"))
      : [],
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      const data = action.payload;

      state.notifications = Array.isArray(data)
        ? data
        : [...state.notifications, data];

      localStorage.setItem(
        "notifications",
        JSON.stringify(state.notifications),
      );
    },

    deleteNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (n) => n._id !== action.payload,
      );
      localStorage.setItem(
        "notifications",
        JSON.stringify(state.notifications),
      );
    },
    markAllRead: (state) => {
      state.notifications = state.notifications.map((n) => ({
        ...n,
        read: true,
      }));
      localStorage.setItem(
        "notifications",
        JSON.stringify(state.notifications),
      );
    },
  },
});

export const {
  setNotifications,

  deleteNotification,
  markAllRead,
} = notificationSlice.actions;
export default notificationSlice.reducer;
