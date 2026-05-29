import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: JSON.parse(localStorage.getItem("notifications")) || [],
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
      localStorage.setItem(
        "notifications",
        JSON.stringify(state.notifications),
      );
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },

    deleteNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (n) => n._id !== action.payload,
      );
    },
    markAllRead: (state) => {
      state.notifications = state.notifications.map((n) => ({
        ...n,
        read: true,
      }));
    },
  },
});

export const {
  setNotifications,
  setLoading,
  setError,
  deleteNotification,
  markAllRead,
} = notificationSlice.actions;
export default notificationSlice.reducer;
