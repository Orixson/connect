import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { configureStore } from '@reduxjs/toolkit';

import reducers from './reducers/reducers';
import AddPostReducer from './reducers/AddPostReducer';
import AuthReducer from './reducers/AuthReducer';
import FeedReducer from './reducers/FeedReducer';
import SelfPostsReducer from './reducers/SelfPostsReducer';
import UserReducer from './reducers/UserReducer';
import authReducer from '../slices/authSlice';
import feedReducer from '../slices/feedSlice';
import userReducer from '../slices/userSlice';
import selfPostsReducer from '../slices/selfPostsSlice';
import addPostReducer from '../slices/addPostSlice';
import deletePostReducer from '../slices/deletePostSlice';
import userUpdateReducer from '../slices/userUpdateSlice';

// export const store = createStore(reducers, applyMiddleware(ReduxThunk));

const createDebugger = require('redux-flipper').default;

export const store = configureStore({
  reducer: {
    auth: authReducer,
    feed: feedReducer,
    user: userReducer,
    userUpdate: userUpdateReducer,
    selfPosts: selfPostsReducer,
    addPost: addPostReducer,
    deletePost: deletePostReducer,
  },
  middleware: getDefaultMiddleware => {
    const middlewares = getDefaultMiddleware({
      serializableCheck: false,
    });
    return __DEV__ ? middlewares.concat(createDebugger()) : middlewares;
  },
});

// import { createStore, applyMiddleware } from 'redux';
// import { configureStore } from '@reduxjs/toolkit';

// import reducers from './reducers/reducers';
// import AddPostReducer from './reducers/AddPostReducer';
// import AuthReducer from './reducers/AuthReducer';
// import FeedReducer from './reducers/FeedReducer';
// import SelfPostsReducer from './reducers/SelfPostsReducer';
// import UserReducer from './reducers/UserReducer';
// import feedSlice from 'store/slices/feedSlice';
// import userSlice from 'store/slices/userSlice';
