import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: JSON.parse(localStorage.getItem("posts")) || [],
  loading: false,
  error: null,
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },

    addPost: (state, action) => {
      state.posts.unshift(action.payload);
      localStorage.setItem("posts", JSON.stringify(state.posts));
    },

    deletePost: (state, action) => {
      state.posts = state.posts.filter((post) => post._id !== action.payload);
      localStorage.setItem("posts", JSON.stringify(state.posts));
    },

    updatePost: (state, action) => {
      state.posts = state.posts.map((post) =>
        post._id === action.payload._id ? action.payload : post,
      );
      localStorage.setItem("posts", JSON.stringify(state.posts));
    },

    likePost: (state, action) => {
      // نفس منطق التحديث تماماً وسهل جداً
      state.posts = state.posts.map((post) =>
        post._id === action.payload._id ? action.payload : post,
      );
      localStorage.setItem("posts", JSON.stringify(state.posts));
    },

    dislikePost: (state, action) => {
      state.posts = state.posts.map((post) =>
        post._id === action.payload._id ? action.payload : post,
      );
      localStorage.setItem("posts", JSON.stringify(state.posts));
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setPosts,
  addPost,
  deletePost,
  updatePost,
  setLoading,
  setError,
  likePost,
  dislikePost,
} = postSlice.actions;

export default postSlice.reducer;
