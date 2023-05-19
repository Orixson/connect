import React, { useState, useEffect, FC } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import { useDispatch } from 'react-redux';

import AuthStack from './stacks/AuthStack';
import AppStack from './stacks/AppStack';
import { Loading } from '../components/Loading';
import { loginStatus } from '../store/slices/authSlice';
import { UserBody } from 'models/user';

const Routes: FC = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserBody>();

  const onAuthStateChanged = authUser => {
    setUser(authUser);
    console.log(authUser);
    dispatch(loginStatus(authUser));
    if (loading) {
      setLoading(false);
    }
  };

  useEffect(() => {
    auth().onAuthStateChanged(onAuthStateChanged);
  }, []);

  if (loading) {
    return <Loading size={8} />;
  }

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default Routes;
