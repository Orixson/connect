import React, { FC, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { PostCard } from 'components';
import { logout } from 'store/redux/actions/AuthActions';
import { getUser, selectUser } from 'store/slices/userSlice';
import { deletePost } from 'store/slices/deletePostSlice';
import { Loading } from 'components/Loading';
import { NavigationProp } from '@react-navigation/core';
import {
  AppScreenRouteProp,
  AppStackParams,
} from 'navigation/types/appStackTypes';
import { PROFILE_ROUTES } from 'navigation/stacks/AppStack';
import { fetchSelfPosts } from 'store/slices/selfPostsSlice';

type ProfileScreenType = {
  navigation: NavigationProp<AppStackParams>;
  route: AppScreenRouteProp;
};

const ProfileScreen: FC<ProfileScreenType> = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const userLoading = useSelector(state => state.auth.loading);
  const posts = useSelector(state => state.selfPosts.posts);
  const postsLoading = useSelector(state => state.selfPosts.loading);
  const userProfile = useSelector(selectUser);
  const userProfileLoading = useSelector(state => state.user.loading);
  const deleted = useSelector(state => state.feed.deleted);
  const deletedLoading = useSelector(state => state.feed.loading);
  console.log('userProfile, user', user, userProfile);
  const userUpdateLoading = useSelector(state => state.userUpdate.loading);

  useEffect(() => {
    dispatch(fetchSelfPosts({ route, user }));
    dispatch(getUser(route, user));
  }, [deleted]);

  const refresh = () => {
    dispatch(getUser(route, user));
    dispatch(fetchSelfPosts({ route, user }));
  };

  const profile = () => {
    return (
      <View style={styles.profileContainer}>
        <Image
          style={styles.userImg}
          source={{
            uri:
              userProfile?.userImg ||
              'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg',
          }}
        />
        <Text style={styles.userName}>{user && user.displayName}</Text>
        <Text style={styles.aboutUser}>
          {userProfile ? userProfile.about || 'No details added.' : ''}
        </Text>
        <View style={styles.userBtnWrapper}>
          {route.params ? (
            <>
              <TouchableOpacity style={styles.userBtn} onPress={() => {}}>
                <Text style={styles.userBtnTxt}>Message</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.userBtn} onPress={() => {}}>
                <Text style={styles.userBtnTxt}>Follow</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.userBtn}
                onPress={() => {
                  navigation.navigate(PROFILE_ROUTES.EDIT_PROFILE, {
                    userId: route?.params?.userId,
                  });
                }}>
                <Text style={styles.userBtnTxt}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.userBtn}
                onPress={() => dispatch(logout())}>
                <Text style={styles.userBtnTxt}>Logout</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.userInfoWrapper}>
          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoTitle}>{posts.length}</Text>
            <Text style={styles.userInfoSubTitle}>Posts</Text>
          </View>
          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoTitle}>10,000</Text>
            <Text style={styles.userInfoSubTitle}>Followers</Text>
          </View>
          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoTitle}>100</Text>
            <Text style={styles.userInfoSubTitle}>Following</Text>
          </View>
        </View>
      </View>
    );
  };

  const handleDelete = (postId: string) => {
    Alert.alert(
      'Delete post',
      'Are you sure?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed!'),
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => dispatch(deletePost({ postId })),
        },
      ],
      { cancelable: false },
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {userLoading || userProfileLoading || postsLoading || deletedLoading ? (
        <Loading size={8} />
      ) : (
        <FlatList
          data={posts}
          renderItem={({ item }) => (
            <PostCard
              post={item}
              user={user}
              onDelete={() => handleDelete(item.id)}
              onPress={() => {}}
            />
          )}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={profile}
          onRefresh={refresh}
          refreshing={userProfileLoading || postsLoading}
        />
      )}
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  activityIndicator: {
    color: 'black',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userImg: {
    height: 150,
    width: 150,
    borderRadius: 75,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  aboutUser: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  userBtnWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
  },
  userBtn: {
    borderColor: '#2e64e5',
    borderWidth: 2,
    borderRadius: 3,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 5,
  },
  userBtnTxt: {
    color: '#2e64e5',
  },
  userInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  userInfoItem: {
    justifyContent: 'center',
  },
  userInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  userInfoSubTitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
