import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import { uploadImage } from 'utils/UploadImage';
import { UserBody } from 'models/user';
import { Dispatch } from 'store/redux/types';
import { UserProfile } from 'models/userProfile';
import { AppScreenRouteProp } from 'navigation/types/appStackTypes';

export const USER_LOADING = 'USER_LOADING';
export const USER_SUCCESS = 'USER_SUCCESS';
export const USER_UPDATE_SUCCESS = 'USER_UPDATE_SUCCESS';
export const USER_DOES_NOT_EXIST = 'USER_DOES_NOT_EXIST';
export const USER_ERROR = 'USER_ERROR';

export const getUser =
  (route: AppScreenRouteProp, user: UserBody) => (dispatch: Dispatch) => {
    dispatch({
      type: USER_LOADING,
    });
    firestore()
      .collection('users')
      .doc(route.params ? route.params.userId : user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          return dispatch({
            type: USER_SUCCESS,
            payload: documentSnapshot.data(),
          });
        }
        dispatch({
          type: USER_DOES_NOT_EXIST,
        });
      })
      .catch(error => {
        dispatch({
          type: USER_ERROR,
          payload: error,
        });
      });
  };

export const handleUpdate =
  (userUid: string, userData: UserProfile, image: string) =>
  async (dispatch: Dispatch) => {
    console.log('handleUpdate userData', userData, userUid, image);
    try {
      dispatch({
        type: USER_LOADING,
      });
      let imgUrl = await uploadImage(image);

      if (imgUrl == null && userData.userImg) {
        imgUrl = userData.userImg;
      }

      firestore()
        .collection('users')
        .doc(userUid)
        .set({
          about: userData.about,
          phone: userData.phone,
          country: userData.country,
          city: userData.city,
          userImg: imgUrl,
        })
        .then(() => {
          dispatch({
            type: USER_UPDATE_SUCCESS,
          });
          firestore()
            .collection('users')
            .doc(userUid)
            .get()
            .then(documentSnapshot => {
              if (documentSnapshot.exists) {
                return dispatch({
                  type: USER_SUCCESS,
                  payload: documentSnapshot.data(),
                });
              }
              dispatch({
                type: USER_DOES_NOT_EXIST,
              });
            });
        });

      await auth().currentUser.updateProfile({ photoURL: imgUrl });
    } catch (err) {
      console.log('ERROR', err);
    }
  };
