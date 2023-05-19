import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import { Alert } from 'react-native';

import { firebaseErrorMessagehandler } from 'utils/FirebaseErrorMessageHandler';
import { UserBody } from 'models/user';
import { FirebaseErrorBody } from 'models/firebaseError';
import { Dispatch } from 'store/redux/types';

interface AuthState {
  loading: boolean;
  user: UserBody | null;
  error: string | null;
}

const initialState: AuthState = {
  loading: false,
  user: null,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setUser(state, action: PayloadAction<UserBody | null>) {
      state.user = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setLoading, setUser, setError } = authSlice.actions;

export default authSlice.reducer;

export const loginStatus = (user: UserBody) => (dispatch: Dispatch) => {
  dispatch(setUser(user));
};

export const login =
  (email: string, password: string) => async (dispatch: Dispatch) => {
    dispatch(setLoading(true));
    try {
      const userCredentials = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      dispatch(setUser(userCredentials.user));
    } catch (err) {
      const fireError = err as FirebaseErrorBody;
      Alert.alert(firebaseErrorMessagehandler(fireError.code));
      dispatch(setError(firebaseErrorMessagehandler(fireError.code)));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const register =
  (name: string, email: string, password: string) =>
  async (dispatch: Dispatch) => {
    dispatch(setLoading(true));
    try {
      const userCredentials = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      if (userCredentials.user) {
        await userCredentials.user.updateProfile({
          displayName: name,
        });
        await userCredentials.user.reload();
        const user = auth().currentUser;
        dispatch(setUser(user));
      }
    } catch (e) {
      dispatch(setError(e.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const googleLogin = (): AppThunk => async dispatch => {
  dispatch(setLoading(true));
  try {
    const { idToken } = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    const userCredentials = await auth().signInWithCredential(googleCredential);
    dispatch(setUser(userCredentials.user));
  } catch (e) {
    dispatch(setError(e.message));
  } finally {
    dispatch(setLoading(false));
  }
};

// export const fbLogin = (): AppThunk => async (dispatch) => {
//   dispatch(setLoading(true));
//   try {
//     const result = await LoginManager.logInWithPermissions([
//       'public_profile',
//       'email',
//     ]);
//     if (result.isCancelled) {
//       throw new Error('User cancelled the login process');
//     }
//     const data = await AccessToken.getCurrentAccessToken();
//     if (!data) {
//       throw new Error('Something went wrong obtaining access token');
//     }
//     const facebookCredential = auth.FacebookAuthProvider.credential(
//       data

export const fbLogin = () => async (dispatch: Dispatch) => {
  try {
    dispatch(setLoading(true));
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);

    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }

    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw 'Something went wrong obtaining access token';
    }

    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );

    // Sign-in the user with the credential
    const user = await auth().signInWithCredential(facebookCredential);
    dispatch(setUser(user.user));
    // dispatch({
    //   type: FB_LOGIN_SUCCESS,
    //   payload: user.user,
    // });
  } catch (e) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};
