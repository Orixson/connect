import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { PostBody } from 'models/post';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
interface DeletePostState {
  posts: PostBody[];
  loading: boolean;
  error: string | null;
}

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (params: { postId; index }, thunkAPI) => {
    try {
      const { postId, index } = params;
      const postImg = await firestore()
        .collection('posts')
        .doc(postId)
        .get()
        .then(documentSnapshot => {
          if (!documentSnapshot.exists) {
            return null;
          }
          const { postImg } = documentSnapshot.data();
          return postImg;
        });

      if (postImg) {
        const storageRef = storage().refFromURL(postImg);
        const imageRef = storage().ref(storageRef.fullPath);

        return imageRef
          .delete()
          .then(() => {
            console.log(`${postImg} has been deleted successfully.`);
            deleteFirestoreData(postId);
          })
          .catch(e => {
            console.log('Error while deleting the image. ', e);
          });
      }
      deleteFirestoreData(postId);
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to delete post');
    }
  },
);

const deleteFirestoreData = (postId: string) => {
  firestore()
    .collection('posts')
    .doc(postId)
    .delete()
    .then(() => {})
    .catch(e => console.log('Error deleting posst.', e));
};

const deletePostSlice = createSlice({
  name: 'deletePost',
  initialState: {
    loading: false,
    error: null,
  } as DeletePostState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(deletePost.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deletePost.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.posts = state.posts.filter((item, index) => index !== payload);
    });
    builder.addCase(deletePost.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
  },
});

export default deletePostSlice.reducer;
