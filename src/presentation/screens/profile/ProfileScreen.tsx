import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { DrawerParamList, MainStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeProvider';
import { PostCard } from '../../components/feature/PostCard';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../stores/authStore';
import { useUserProfileViewModel } from '../../viewmodels/useUserProfileViewModel';

type NavigationProp = CompositeNavigationProp<
  DrawerNavigationProp<DrawerParamList>,
  NativeStackNavigationProp<MainStackParamList>
>;

// This component contains the actual UI and logic.
// It's rendered by the `ProfileScreen` wrapper and assumes `currentUser` is available.
function ProfileScreenContent() {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation<NavigationProp>();
  const { user: currentUser } = useAuthStore();
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(new Set());

  // The wrapper guarantees `currentUser` is not null, so we can use a non-null assertion `!`.
  const {
    profileData,
    isLoading,
    error,
    loadMorePosts,
    isLoadingMore,
    refreshProfile,
    handleLikePost,
    isPostLiked,
  } = useUserProfileViewModel(currentUser!.id);

  const handleComment = useCallback((postId: string) => {
    const post = profileData?.posts.items.find(p => p.id === postId);
    navigation.navigate('PostDetails', { postId, post });
  }, [navigation, profileData?.posts.items]);

  const handleUserProfile = useCallback((userId: string, userName?: string) => {
    // On own profile, so no action needed.
    console.log("Attempted to navigate to user profile:", userId);
  }, []);

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
  }, []);

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

  const renderPost = ({ item }: { item: any }) => (
    <PostCard
      item={item}
      onLike={handleLikePost}
      onComment={handleComment}
      onBookmark={handleBookmark}
      onUserPress={handleUserProfile}
      isLiked={isPostLiked(item.id)}
      isBookmarked={bookmarkedPosts.has(item.id)}
    />
  );

  const renderHeader = () => {
    if (!profileData) return null;

    return (
      <View>
        <View style={styles.userSection}>
          <View style={styles.userHeader}>
            <LinearGradient
              colors={[theme.primary, theme.ring]}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>
                {profileData.user.firstName?.[0]?.toUpperCase() || 'U'}
              </Text>
            </LinearGradient>
            
            <View style={styles.userInfo}>
              <Text style={styles.fullName}>
                {profileData.user.firstName} {profileData.user.lastName}
              </Text>
              <Text style={styles.username}>@{profileData.user.userName}</Text>
              <Text style={styles.email}>{profileData.user.email}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="settings-outline" size={24} color={theme.foreground} />
          </TouchableOpacity>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{profileData.user.followers || 0}</Text>
              <Text style={styles.statLabel}>Takipçi</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{profileData.user.following || 0}</Text>
              <Text style={styles.statLabel}>Takip</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{profileData.posts.totalCount || 0}</Text>
              <Text style={styles.statLabel}>Gönderi</Text>
            </View>
          </View>
        </View>

        <View style={styles.postsHeader}>
          <Text style={styles.sectionTitle}>Gönderiler</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={profileData?.posts.items || []}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
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
        ListEmptyComponent={
          !isLoading && !profileData ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={64} color="#d1d5db" />
              <Text style={styles.emptyText}>Henüz gönderi yok</Text>
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

// This is the exported component. It acts as a wrapper to ensure `currentUser` is loaded.
export default function ProfileScreen() {
  const { user: currentUser } = useAuthStore();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  if (!currentUser) {
    // Render a loading state until the user is authenticated and loaded.
    // This prevents hook rule violations in the content component.
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>Kullanıcı bilgileri yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Once we have a user, render the main content.
  return <ProfileScreenContent />;
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
    color: theme.foreground,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: theme.foreground,
    textAlign: 'center',
    marginVertical: 16,
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: theme.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  retryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userSection: {
    padding: 16,
    backgroundColor: theme.card,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  userInfo: {
    flex: 1,
  },
  fullName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.foreground,
  },
  username: {
    fontSize: 16,
    color: theme.mutedForeground,
    marginTop: 2,
  },
  email: {
    fontSize: 14,
    color: theme.mutedForeground,
    marginTop: 2,
  },
  settingsButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.foreground,
  },
  statLabel: {
    fontSize: 12,
    color: theme.mutedForeground,
    marginTop: 4,
  },
  postsHeader: {
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.foreground,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.mutedForeground,
    marginTop: 16,
  },
  loadingMore: {
    padding: 20,
    alignItems: 'center',
  },
});