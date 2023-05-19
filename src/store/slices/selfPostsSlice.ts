import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';
import { PostBody } from 'models/post';
import { UserBody } from 'models/user';
import { AppScreenRouteProp } from 'navigation/types/appStackTypes';

interface SelfPostsState {
  posts: PostBody[];
  loading: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: SelfPostsState = {
  posts: [],
  loading: false,
  status: 'idle',
  error: null,
};

export const fetchSelfPosts = createAsyncThunk(
  'profile/fetchSelfPosts',
  async (params: { route: AppScreenRouteProp; user: UserBody }, thunkAPI) => {
    try {
      const { route, user } = params;
      const querySnapshot = await firestore()
        .collection('posts')
        .where('userId', '==', route.params ? route.params.userId : user.uid)
        .orderBy('postTime', 'desc')
        .get();

      const list: PostBody[] = [];
      querySnapshot.forEach(doc => {
        const {
          userId,
          userName,
          userImg,
          post,
          postImg,
          postTime,
          liked,
          likes,
          comments,
        } = doc.data();
        list.push({
          id: doc.id,
          userId,
          userName,
          userImg,
          postTime,
          post,
          postImg,
          liked,
          likes,
          comments,
        });
      });

      return list;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

const selfPostsSlice = createSlice({
  name: 'selfPosts',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchSelfPosts.pending, state => {
        state.status = 'loading';
        state.loading = true;
      })
      .addCase(fetchSelfPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload;
        state.loading = false;
      })
      .addCase(fetchSelfPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export default selfPostsSlice.reducer;
