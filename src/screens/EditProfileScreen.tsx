import React, { FC, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import ImagePicker from 'react-native-image-crop-picker';

import { FormButton } from 'components';
import { totalSize } from 'utils/Dimentions';
import { Loading } from 'components/Loading';
import { UserProfile } from 'models/userProfile';
import { handleUpdate } from 'store/slices/userUpdateSlice';

type EditProfileScreenType = {};

const EditProfileScreen: FC<EditProfileScreenType> = () => {
  const user = useSelector(state => state.auth.user);
  const userProfile = useSelector(state => state.user.data);
  const loading = useSelector(state => state.user.loading);
  const dispatch = useDispatch();

  const [image, setImage] = useState<string>();
  const [userData, setUserData] = useState<UserProfile>();
  console.log('userProfile', userProfile);

  const bs = React.createRef();
  const fall = new Animated.Value(1);

  useEffect(() => {
    setUserData(userProfile);
  }, []);

  const update = () => {
    dispatch(handleUpdate(user.uid, userData, image));
  };

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
      cropping: true,
      compressImageQuality: 0.7,
    }).then(image => {
      console.log(image);
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
      setImage(imageUri);
      bs.current.snapTo(1);
    });
  };

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      compressImageQuality: 0.7,
    })
      .then(image => {
        console.log('image', image);
        const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
        setImage(imageUri);
        bs.current.snapTo(1);
      })
      .catch(err => console.log('choosePhotoFromLibrary', err));
  };

  const renderInner = () => (
    <View style={styles.panel}>
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.panelTitle}>Upload Photo</Text>
        <Text style={styles.panelSubtitle}>Choose Your Profile Picture</Text>
      </View>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={takePhotoFromCamera}>
        <Text style={styles.panelButtonTitle}>Take Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={choosePhotoFromLibrary}>
        <Text style={styles.panelButtonTitle}>Choose From Library</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={() => bs.current.snapTo(1)}>
        <Text style={styles.panelButtonTitle}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <Loading size={8} />
      ) : (
        <KeyboardAvoidingView behavior="position" style={styles.container}>
          <BottomSheet
            ref={bs}
            snapPoints={[330, -200]}
            enabledBottomClamp={true}
            renderContent={renderInner}
            renderHeader={renderHeader}
            initialSnap={1}
            callbackNode={fall}
            enabledGestureInteraction={true}
          />
          <Animated.View
            style={{
              margin: 20,
              marginBottom: totalSize(15),
              opacity: Animated.add(0.1, Animated.multiply(fall, 1.0)),
            }}>
            <View style={{ alignItems: 'center' }}>
              <TouchableOpacity onPress={() => bs.current.snapTo(0)}>
                <View
                  style={{
                    height: 100,
                    width: 100,
                    borderRadius: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <ImageBackground
                    source={{
                      uri: image
                        ? image
                        : userData
                        ? userData.userImg
                        : 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg',
                    }}
                    style={{ height: 100, width: 100 }}
                    imageStyle={{ borderRadius: 15 }}>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <MaterialCommunityIcons
                        name="camera"
                        size={35}
                        color="#fff"
                        style={{
                          opacity: 0.7,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderWidth: 1,
                          borderColor: '#fff',
                          borderRadius: 10,
                        }}
                      />
                    </View>
                  </ImageBackground>
                </View>
              </TouchableOpacity>
              <Text
                style={{
                  marginVertical: 20,
                  fontSize: 18,
                  fontWeight: 'bold',
                }}>
                {user.displayName}
              </Text>
            </View>
            <View style={styles.action}>
              <Ionicons
                name="ios-clipboard-outline"
                color="#333333"
                size={20}
              />
              <TextInput
                multiline
                numberOfLines={3}
                placeholder="About Me"
                placeholderTextColor="#666666"
                value={userData ? userData.about : ''}
                onChangeText={txt => setUserData({ ...userData, about: txt })}
                autoCorrect={true}
                style={[styles.textInput, { height: 40 }]}
              />
            </View>
            <View style={styles.action}>
              <Feather name="phone" color="#333333" size={20} />
              <TextInput
                placeholder="Phone"
                placeholderTextColor="#666666"
                keyboardType="phone-pad"
                autoCorrect={false}
                value={userData ? userData.phone : ''}
                onChangeText={txt => setUserData({ ...userData, phone: txt })}
                style={styles.textInput}
              />
            </View>

            <View style={styles.action}>
              <FontAwesome name="globe" color="#333333" size={20} />
              <TextInput
                placeholder="Country"
                placeholderTextColor="#666666"
                autoCorrect={false}
                value={userData ? userData.country : ''}
                onChangeText={txt => setUserData({ ...userData, country: txt })}
                style={styles.textInput}
              />
            </View>
            <View style={styles.action}>
              <MaterialCommunityIcons
                name="map-marker-outline"
                color="#333333"
                size={20}
              />
              <TextInput
                placeholder="City"
                placeholderTextColor="#666666"
                autoCorrect={false}
                value={userData ? userData.city : ''}
                onChangeText={txt => setUserData({ ...userData, city: txt })}
                style={styles.textInput}
              />
            </View>
            <FormButton buttonTitle="Update" onPress={update} />
          </Animated.View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginTop: 10,
  },
  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    width: '100%',
  },
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#333333',
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#2e64e5',
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#333333',
  },
});
