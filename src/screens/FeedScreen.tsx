import React, { FC, useEffect } from 'react';
import { FlatList, Alert, SafeAreaView, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import { Container } from '@styles/FeedStyles';
import { PostCard, ShimmerEffect } from 'components';
import { getPosts, deletePost } from '@store/slices/feedSlice';
import { PostBody } from 'models/post';
import { UserBody } from 'models/user';
import { NavigationProp } from '@react-navigation/core';
import {
  AppScreenNavigationProp,
  AppStackParams,
} from 'navigation/types/appStackTypes';
import { PROFILE_ROUTES } from 'navigation/stacks/AppStack';

type FeedScreenType = {
  navigation: NavigationProp<AppStackParams>;
  posts: PostBody[];
  user: UserBody;
  getPosts: () => void;
  deletePost: (postId: string, index: number) => void;
  loading: boolean;
  deleted: boolean;
};

const FeedScreen: FC<FeedScreenType> = () => {
  const { navigate } = useNavigation<AppScreenNavigationProp>();
  const dispatch = useDispatch();
  const posts = useSelector(state => state.feed.data);
  const loading = useSelector(state => state.feed.loading);
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    dispatch(getPosts());
  }, []);

  const handleDelete = (postId: string, index: number) => {
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
          onPress: () => dispatch(deletePost(postId, index)),
        },
      ],
      { cancelable: false },
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ShimmerEffect />
      ) : (
        <Container>
          <FlatList
            data={posts}
            renderItem={({ item, index }) => (
              <PostCard
                post={item}
                user={user}
                postIndex={index}
                onDelete={handleDelete}
                onPress={() =>
                  navigate(PROFILE_ROUTES.PROFILE, {
                    userId: item.userId,
                  })
                }
              />
            )}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            onRefresh={() => dispatch(getPosts())}
            refreshing={loading}
          />
        </Container>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default React.memo(FeedScreen);
