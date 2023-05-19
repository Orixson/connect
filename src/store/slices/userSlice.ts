import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { ApplicationState } from '@models/state';
import { ErrorAlert } from 'models/base';
import { UserProfile } from 'models/userProfile';
import firestore from '@react-native-firebase/firestore';

export interface UserState {
  data: UserProfile | null;
  loading: boolean;
  error?: ErrorAlert | null;
}

const initialState: UserState = {
  data: null,
  loading: false,
  error: null,
};

export const getUser = createAsyncThunk('user/getUser', async (route, user) => {
  const querySnapshot = await firestore().collection('users').get();
  if (!querySnapshot.docs.length) {
    throw new Error('User does not exist.');
  }

  const userDoc = querySnapshot.docs[0];

  return userDoc.data() as UserProfile;
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserState: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(getUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getUser.fulfilled,
        (state, action: PayloadAction<UserProfile>) => {
          state.data = action.payload;
          state.loading = false;
          state.error = null;
        },
      )
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message
          ? { message: action.error.message }
          : { message: 'Something went wrong. Please try again.' };
      });
  },
});

export const { clearUserState } = userSlice.actions;

export const selectUser = (state: ApplicationState) => state.user.data;
export const selectUserLoading = (state: ApplicationState) =>
  state.user.loading;
export const selectUserError = (state: ApplicationState) => state.user.error;

export default userSlice.reducer;
