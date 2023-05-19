import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';
import { uploadImage } from 'utils/UploadImage';
import { PostBody } from 'models/post';
import { UserBody } from 'models/user';

interface PostState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PostState = {
  status: 'idle',
  error: null,
};

export const submitPost = createAsyncThunk(
  'post/submitPost',
  async (
    { user, post, image }: { user: UserBody; post: PostBody; image: string },
    thunkAPI,
  ) => {
    const imageUrl = await uploadImage(image);

    try {
      const postRef = firestore().collection('posts');
      await postRef.add({
        userId: user.uid,
        userName: user.displayName,
        userImg: user.photoURL || null,
        post,
        postImg: imageUrl,
        postTime: firestore.Timestamp.fromDate(new Date()),
        likes: null,
        comments: null,
      });
    } catch (error) {
      console.log('Something went wrong with added post to firestore.', error);
      return thunkAPI.rejectWithValue('Failed to add post to firestore.');
    }
  },
);

const postSlice = createSlice({
  name: 'addPost',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(submitPost.pending, state => {
        state.status = 'loading';
      })
      .addCase(submitPost.fulfilled, state => {
        state.status = 'succeeded';
      })
      .addCase(submitPost.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default postSlice.reducer;
