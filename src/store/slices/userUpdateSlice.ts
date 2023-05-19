import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import { uploadImage } from 'utils/UploadImage';
// import { AppThunk } from 'store/redux/types';
import { UserProfile } from 'models/userProfile';

interface UserState {
  loading: boolean;
  success: boolean;
  doesNotExist: boolean;
  error: string | null;
}

const initialState: UserState = {
  loading: false,
  success: false,
  doesNotExist: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userLoading: state => {
      state.loading = true;
      state.success = false;
      state.doesNotExist = false;
      state.error = null;
    },
    userSuccess: state => {
      state.loading = false;
      state.success = true;
      state.doesNotExist = false;
      state.error = null;
    },
    userUpdateSuccess: state => {
      state.loading = false;
      state.success = true;
      state.doesNotExist = false;
      state.error = null;
    },
    userDoesNotExist: state => {
      state.loading = false;
      state.success = false;
      state.doesNotExist = true;
      state.error = null;
    },
    userError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.success = false;
      state.doesNotExist = false;
      state.error = action.payload;
    },
  },
});

export const {
  userLoading,
  userSuccess,
  userUpdateSuccess,
  userDoesNotExist,
  userError,
} = userSlice.actions;

export const handleUpdate =
  (userUid: string, userData: UserProfile, image: string) => async dispatch => {
    console.log('handleUpdate userData', userData, userUid, image);
    try {
      dispatch(userLoading());
      let imgUrl = await uploadImage(image);

      if (imgUrl == null && userData.userImg) {
        imgUrl = userData.userImg;
      }

      await firestore().collection('users').doc(userUid).set({
        about: userData.about,
        phone: userData.phone,
        country: userData.country,
        city: userData.city,
        userImg: imgUrl,
      });

      dispatch(userUpdateSuccess());

      const documentSnapshot = await firestore()
        .collection('users')
        .doc(userUid)
        .get();
      console.log('documentSnapshot.data()', documentSnapshot.data());

      if (documentSnapshot.exists) {
        dispatch(userSuccess(documentSnapshot.data()));
      } else {
        dispatch(userDoesNotExist());
      }

      await auth().currentUser?.updateProfile({ photoURL: imgUrl });
    } catch (err) {
      dispatch(userError(err.message));
      console.log('ERROR', err);
    }
  };

export default userSlice.reducer;
