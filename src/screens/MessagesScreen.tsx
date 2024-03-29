import React, { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { FormButton } from '../components';
import { connect } from 'react-redux';
import { logout } from '../store/redux/actions/AuthActions';
import { UserBody } from 'models/user';

type MessagesScreenType = {
  user: UserBody;
  logout: () => void;
};

const MessagesScreen: FC<MessagesScreenType> = ({ user, logout }) => {
  return (
    <View style={styles.container}>
      <Text>Welcome {user.uid}</Text>
      <FormButton buttonTitle="Log Out" onPress={logout} />
    </View>
  );
};

const mapStateToProps = ({ auth }) => ({
  user: auth.user,
});

const mapDispatchToProps = {
  logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(MessagesScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
