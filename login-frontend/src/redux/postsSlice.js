import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/api";


// ===============================
// GET POSTS
// SERVER-SIDE PAGINATION
// ===============================

export const fetchPosts = createAsyncThunk(
    "posts/fetchPosts",

    async ({ page, limit }, { rejectWithValue }) => {

        try {

            const response = await api.get(
                `/posts?page=${page}&limit=${limit}`
            );

            return response.data;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch posts"
            );

        }

    }
);


// ===============================
// CREATE POST
// ===============================

export const createPost = createAsyncThunk(
    "posts/createPost",

    async (postData, { rejectWithValue }) => {

        try {

            const response = await api.post(
                "/posts",
                postData
            );

            return response.data;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to create post"
            );

        }

    }
);


// ===============================
// UPDATE POST
// ===============================

export const updatePost = createAsyncThunk(
    "posts/updatePost",

    async ({ id, title, body }, { rejectWithValue }) => {

        try {

            const response = await api.put(
                `/posts/${id}`,
                {
                    title,
                    body
                }
            );

            return response.data;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to update post"
            );

        }

    }
);


// ===============================
// DELETE POST
// ===============================

export const deletePost = createAsyncThunk(
    "posts/deletePost",

    async (id, { rejectWithValue }) => {

        try {

            const response = await api.delete(
                `/posts/${id}`
            );

            return response.data;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to delete post"
            );

        }

    }
);


// ===============================
// INITIAL STATE
// ===============================

const initialState = {

    posts: [],

    loading: false,

    error: null,

    currentPage: 1,

    totalPages: 1,

    totalPosts: 0

};


// ===============================
// POSTS SLICE
// ===============================

const postsSlice = createSlice({

    name: "posts",

    initialState,

    reducers: {},

    extraReducers: (builder) => {

        builder

            // ===============================
            // FETCH POSTS
            // ===============================

            .addCase(fetchPosts.pending, (state) => {

                state.loading = true;

                state.error = null;

            })

            .addCase(fetchPosts.fulfilled, (state, action) => {

                state.loading = false;

                state.posts = action.payload.posts;

                state.currentPage =
                    action.payload.currentPage;

                state.totalPages =
                    action.payload.totalPages;

                state.totalPosts =
                    action.payload.totalPosts;

            })

            .addCase(fetchPosts.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload;

            })


            // ===============================
            // CREATE POST
            // ===============================

            .addCase(createPost.pending, (state) => {

                state.loading = true;

                state.error = null;

            })

            .addCase(createPost.fulfilled, (state) => {

                state.loading = false;

            })

            .addCase(createPost.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload;

            })


            // ===============================
            // UPDATE POST
            // ===============================

            .addCase(updatePost.pending, (state) => {

                state.loading = true;

                state.error = null;

            })

            .addCase(updatePost.fulfilled, (state) => {

                state.loading = false;

            })

            .addCase(updatePost.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload;

            })


            // ===============================
            // DELETE POST
            // ===============================

            .addCase(deletePost.pending, (state) => {

                state.loading = true;

                state.error = null;

            })

            .addCase(deletePost.fulfilled, (state) => {

                state.loading = false;

            })

            .addCase(deletePost.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload;

            });

    }

});


export default postsSlice.reducer;