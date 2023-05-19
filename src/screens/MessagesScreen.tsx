import React, { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { FormButton } from '../components';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/redux/actions/AuthActions';

const MessagesScreen: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  return (
    <View style={styles.container}>
      <Text>Welcome {user.uid}</Text>
      <FormButton buttonTitle="Log Out" onPress={() => dispatch(logout())} />
    </View>
  );
};

export default MessagesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
