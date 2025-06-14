import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  SafeAreaView,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme/ThemeProvider';
import { useUserProfileViewModel } from '../../viewmodels/useUserProfileViewModel';
import { PostCard } from '../../components/feature/PostCard';
import { useAuthStore } from '../../stores/authStore';
import { CompatibilityReport } from '../../components/feature/CompatibilityReport';
import { UserProfileViewData } from '../../viewmodels/useUserProfileViewModel';

// Like use cases
import { LikeUseCase } from '../../../core/domain/usecases/like/LikeUseCase';
import { UnlikePostUseCase } from '../../../core/domain/usecases/like/UnlikePostUseCase';
import { LikeRepositoryImpl } from '../../../core/data/repositories/LikeRepositoryImpl';
import LikeApi from '../../../core/data/datasources/remote/LikeApi';

const { width } = Dimensions.get('window');

import { DrawerScreenProps } from '@react-navigation/drawer';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DrawerParamList, MainStackParamList } from '../../navigation/types';

type UserProfileScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParamList, 'UserProfile'>,
  DrawerScreenProps<DrawerParamList>
>;

// Repository instances
const likeRepository = new LikeRepositoryImpl(LikeApi);
const likeUseCase = new LikeUseCase(likeRepository);
const unlikePostUseCase = new UnlikePostUseCase(likeRepository);

export default function UserProfileScreen({ route, navigation }: UserProfileScreenProps) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { userId, userName } = route.params;
  const { user } = useAuthStore();

  // Eğer kullanıcı kendi profiline girmeye çalışırsa Profile ekranına yönlendir
  useEffect(() => {
    if (user && user.id === userId) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'DrawerNavigator', params: { screen: 'Profile' } }],
      });
    }
  }, [user, userId, navigation]);

  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(new Set());

  const {
    profileData,
    isLoading,
    error,
    handleFollowUser,
    loadMorePosts,
    isLoadingMore,
    isFollowLoading,
    refreshProfile,
    handleLikePost,
    isPostLiked,
  } = useUserProfileViewModel(userId);

  // Test console.log for button press
  const handleFollowPress = useCallback(() => {
    console.log('🔴 SCREEN: Follow button physically pressed!');
    handleFollowUser();
  }, [handleFollowUser]);

  const renderMoodCompatibility = (moodCompatibility: UserProfileViewData['moodCompatibility']) => {
    if (!moodCompatibility) return null;

    return (
      <View style={styles.compatibilitySection}>
        <Text style={styles.sectionTitle}>Ruh Hali Uyumu</Text>
        <CompatibilityReport compatibilityData={moodCompatibility} />
      </View>
    );
  };

  const handleComment = useCallback((postId: string) => {
    const post = profileData?.posts.items.find(p => p.id === postId);
    navigation.navigate('PostDetails', { postId, post });
  }, [navigation, profileData?.posts.items]);

  const handleUserProfile = useCallback((userId: string, userName?: string) => {
    if (userId !== route.params.userId) {
      navigation.push('UserProfile', { userId, userName });
    }
  }, [navigation, route.params.userId]);

  const handleBookmark = useCallback((postId: string) => {
    setBookmarkedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
    console.log('Bookmark post:', postId);
  }, []);

  const renderPost = ({ item }: { item: any }) => (
    <PostCard
      item={item}
      onLike={handleLikePost}
      onComment={handleComment}
      onBookmark={handleBookmark}
      onUserPress={handleUserProfile}
      isLiked={isPostLiked(item.id)}
      isBookmarked={bookmarkedPosts.has(item.id)}
      showMoodCompatibility={true}
    />
  );

  const renderHeader = (data: UserProfileViewData | null) => {
    if (!data) return null;
    
    return (
      <View key="header-container">
        {/* User Info Section */}
        <View key="user-section" style={styles.userSection}>
          <View style={styles.userHeader}>
            <LinearGradient
              colors={[theme.primary, theme.ring]}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>
                {data.user.firstName?.[0]?.toUpperCase() || 'U'}
              </Text>
            </LinearGradient>
            
            <View style={styles.userInfo}>
              <Text style={styles.fullName}>
                {data.user.firstName} {data.user.lastName}
              </Text>
              <Text style={styles.username}>@{data.user.userName}</Text>
              <Text style={styles.email}>{data.user.email}</Text>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.followButton,
              data.isFollowing && styles.followingButton,
              isFollowLoading && styles.disabledButton,
              pressed && styles.pressedButton
            ]}
            onPress={handleFollowPress}
            disabled={isFollowLoading}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {isFollowLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text
                style={[
                  styles.followButtonText,
                  data.isFollowing && styles.followingButtonText
                ]}
              >
                {data.isFollowing ? 'Takipte' : 'Takip Et'}
              </Text>
            )}
          </Pressable>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{data.user.followers || 0}</Text>
              <Text style={styles.statLabel}>Takipçi</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{data.user.following || 0}</Text>
              <Text style={styles.statLabel}>Takip</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{data.posts.totalCount || 0}</Text>
              <Text style={styles.statLabel}>Gönderi</Text>
            </View>
          </View>
        </View>

        {/* Mood Compatibility Section */}
        {renderMoodCompatibility(data.moodCompatibility)}

        {/* Posts Header */}
        <View key="posts-header" style={styles.postsHeader}>
          <Text style={styles.sectionTitle}>Gönderiler</Text>
        </View>
      </View>
    )
  };

  if (isLoading && !profileData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>Profil yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !profileData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refreshProfile}>
            <Text style={styles.retryText}>Tekrar Dene</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={profileData?.posts.items || []}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => renderHeader(profileData)}
        onEndReached={loadMorePosts}
        onEndReachedThreshold={0.5}
        keyboardShouldPersistTaps="handled"
        ListFooterComponent={
          isLoadingMore ? (
            <View style={styles.loadingMore}>
              <ActivityIndicator size="small" color={theme.primary} />
            </View>
          ) : null
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        onRefresh={refreshProfile}
        refreshing={isLoading}
      />
    </SafeAreaView>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  listContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.mutedForeground,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.mutedForeground,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: theme.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  userSection: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.border,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  userInfo: {
    flex: 1,
  },
  fullName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.foreground,
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: theme.mutedForeground,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: theme.mutedForeground,
  },
  followButton: {
    backgroundColor: theme.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  followingButton: {
    backgroundColor: theme.secondary,
  },
  followButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  followingButtonText: {
    color: theme.foreground,
  },
  disabledButton: {
    opacity: 0.6,
  },
  pressedButton: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.foreground,
  },
  statLabel: {
    fontSize: 14,
    color: theme.mutedForeground,
    marginTop: 4,
  },
  compatibilitySection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.foreground,
    marginBottom: 12,
  },
  compatibilityCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  compatibilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  compatibilityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  compatibilityPercentage: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  compatibilityCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
  },
  compatibilityMessage: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
  },
  postsHeader: {
    marginBottom: 16,
  },
  loadingMore: {
    padding: 20,
    alignItems: 'center',
  },
}); 