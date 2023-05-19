import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { PostBody } from 'models/post';
import { Dispatch } from 'store/redux/types';

interface Post {
  id: string;
  userId: string;
  userName: string;
  userImg: string;
  post: string;
  postImg: string;
  postTime: number;
  liked: boolean;
  likes: number;
  comments: number;
}

interface PostsState {
  loading: boolean;
  data: Post[];
  error: any;
}

const initialState: PostsState = {
  loading: false,
  data: [],
  error: null,
};

export const getPosts = createAsyncThunk('posts/getPosts', async () => {
  const posts: Post[] = [];

  const querySnapshot = await firestore().collection('posts').get();
  querySnapshot.forEach(doc => {
    const {
      userId,
      userName,
      userImg,
      post,
      postImg,
      postTime,
      likes,
      comments,
    } = doc.data();
    posts.push({
      id: doc.id,
      userId,
      userName,
      userImg,
      postTime: postTime,
      post,
      postImg,
      liked: false,
      likes,
      comments,
    });
  });

  return posts;
});

const postsSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getPosts.pending, state => {
        state.loading = true;
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default postsSlice.reducer;
