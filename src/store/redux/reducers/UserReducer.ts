import {
  USER_LOADING,
  USER_SUCCESS,
  USER_UPDATE_SUCCESS,
  USER_DOES_NOT_EXIST,
  USER_ERROR,
} from '../actions/UserActions';
import { ApplicationState } from '@models/state';
import { HandlerAction, Handlers } from '../types';
import { Reducer } from 'redux';
import { ErrorAlert } from 'models/base';
import { UserProfile } from 'models/userProfile';

const initState = {
  data: {},
  loading: false,
};

export type UserState = ApplicationState['user'];

const handlers: Handlers<UserState> = {
  [USER_LOADING]: state => ({
    ...state,
    loading: true,
  }),
  [USER_SUCCESS]: (state, action: HandlerAction<UserProfile>) => ({
    ...state,
    data: action.payload,
    loading: false,
  }),
  [USER_UPDATE_SUCCESS]: state => ({
    ...state,
    loading: false,
  }),
  [USER_DOES_NOT_EXIST]: state => ({
    ...state,
    loading: false,
  }),
  [USER_ERROR]: (state, action: HandlerAction<ErrorAlert>) => ({
    ...state,
    loading: false,
    error: action.payload,
  }),
  DEFAULT: state => state,
};

const userReducer: Reducer<UserState, HandlerAction> = (
  state = initState,
  action,
) => {
  const handler = handlers[action.type] || handlers.DEFAULT;
  return handler(state, action);
};

export default userReducer;
