import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { windowHeight } from '../utils/Dimentions';

const FormButton = ({ buttonTitle, ...rest }) => {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity {...rest}>
        <Text style={styles.buttonText}>{buttonTitle}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FormButton;

const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
    height: windowHeight / 15,
    backgroundColor: '#2e64e5',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    fontFamily: 'Lato-Regular',
  },
});
