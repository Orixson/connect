import React, { FC, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { NavigationProp } from '@react-navigation/core';
import { AUTH_ROUTES } from '@navigation/stacks/AuthStack';

import { FormButton, FormInput, SocialButton } from 'components';
import { register, fbLogin, googleLogin } from 'store/slices/authSlice';
import { totalSize } from 'utils/Dimentions';
import { emailRegEx } from 'utils/Constants';
import { Color } from 'utils/Color';
import { AuthStackParams } from 'navigation/types/authStackTypes';
import { SafeAreaView } from 'react-native-safe-area-context';

type SignUpScreenType = {
  navigation: NavigationProp<AuthStackParams>;
};

const SignUpScreen: FC<SignUpScreenType> = ({ navigation }) => {
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const onSignin = ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) => {
    dispatch(register(name, email, password));
  };

  const password = useRef({});
  password.current = watch('password', '');

  return (
    <SafeAreaView>
      <ScrollView>
        <KeyboardAvoidingView
          keyboardVerticalOffset={100}
          style={styles.container}>
          <Text style={styles.text}>Create an account</Text>
          <Controller
            name="name"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormInput
                value={value}
                error={errors.name}
                onChangeText={userName => onChange(userName)}
                placeholder="Name"
                iconType="user"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            )}
            rules={{
              required: { value: true, message: 'Enter name' },
              minLength: {
                value: 3,
                message: 'Name must have at least 3 characters',
              },
            }}
            defaultValue=""
          />

          <Controller
            name="email"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormInput
                value={value}
                error={errors.email}
                onChangeText={(userEmail: string) => onChange(userEmail)}
                placeholder="Email"
                iconType="user"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            )}
            rules={{
              required: { value: true, message: 'Enter email' },
              pattern: {
                value: emailRegEx,
                message: 'Invalid email',
              },
            }}
            defaultValue=""
          />
          <Controller
            name="password"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormInput
                value={value}
                error={errors.password}
                onChangeText={(userPassword: string) => onChange(userPassword)}
                placeholder="Password"
                iconType="lock"
                secureTextEntry={true}
              />
            )}
            rules={{
              required: { value: true, message: 'Enter password' },
              minLength: {
                value: 6,
                message: 'Password must have at least 6 characters',
              },
            }}
            defaultValue=""
          />

          <Controller
            name="confirmPassword"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormInput
                value={value}
                error={errors.confirmPassword}
                onChangeText={(userPassword: string) => onChange(userPassword)}
                placeholder="Confirm Password"
                iconType="lock"
                secureTextEntry={true}
              />
            )}
            rules={{
              required: { value: true, message: 'Confirm password' },
              minLength: {
                value: 6,
                message: 'Password must have at least 6 characters',
              },
              validate: value =>
                value === password.current || 'The passwords do not match',
            }}
            defaultValue=""
          />

          <FormButton buttonTitle="Sign Up" onPress={handleSubmit(onSignin)} />

          <SocialButton
            buttonTitle="Sign in with Facebook"
            onPress={() => dispatch(fbLogin())}
            btnType="facebook"
            color={Color.fb}
            backgroundColor={Color.fbBackground}
          />

          <SocialButton
            buttonTitle="Sign in with Google"
            onPress={() => dispatch(googleLogin())}
            btnType="google"
            color={Color.google}
            backgroundColor={Color.googleBackground}
          />

          <View style={styles.textPrivate}>
            <Text style={styles.color_textPrivate}>
              By registering, you confirm that you accept our{' '}
            </Text>
            <TouchableOpacity onPress={() => {}}>
              <Text style={[styles.color_textPrivate, { color: '#e88832' }]}>
                Terms of service
              </Text>
            </TouchableOpacity>
            <Text style={styles.color_textPrivate}> and </Text>
            <Text style={[styles.color_textPrivate, { color: '#e88832' }]}>
              Privacy Policy
            </Text>
          </View>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate(AUTH_ROUTES.LOGIN)}>
            <Text style={styles.navButtonText}>Have an account? Sign In</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: totalSize(2),
  },
  text: {
    fontFamily: 'Kufam-SemiBoldItalic',
    fontSize: 28,
    marginVertical: totalSize(5),
    color: '#051d5f',
  },
  navButton: {
    marginTop: 15,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2e64e5',
    fontFamily: 'Lato-Regular',
  },
  textPrivate: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: totalSize(5),

    justifyContent: 'center',
  },
  color_textPrivate: {
    fontSize: 13,
    fontWeight: '400',
    fontFamily: 'Lato-Regular',
    color: 'grey',
  },
});
