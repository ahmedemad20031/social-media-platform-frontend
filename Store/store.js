import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../Slice/userslice";
import postSlice from "../Slice/Postsilce";
import notificationSlice from "../Slice/notificaionslice";

const store = configureStore({
  reducer: {
    user: userSlice,
    posts: postSlice,
    notifications: notificationSlice,
  },
});

export default store;
