import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Animated, { FadeIn } from 'react-native-reanimated';
import { useEnhancedHomeViewModel } from "../../../viewmodels/useEnhancedHomeViewModel";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { CompositeNavigationProp } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DrawerParamList, MainStackParamList } from '../../../navigation/types';
import { useTheme } from "../../../theme/ThemeProvider";
import { PostCard } from "../../../components/feature/PostCard";
import { LoadingSpinner } from "../../../components/common/LoadingSpinner";
import { EmptyState } from "../../../components/common/EmptyState";
import { Toast, ToastType } from "../../../components/common/Toast";
import { CreatePost } from "../../../components/feature/CreatePost";

interface FeedScreenProps {
  type: "forYou" | "following";
}

type NavigationProp = CompositeNavigationProp<
  DrawerNavigationProp<DrawerParamList>,
  NativeStackNavigationProp<MainStackParamList>
>;

export function FeedScreen({ type }: FeedScreenProps) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation<NavigationProp>();
  
  const {
    posts,
    isLoading,
    isRefreshing,
    isCreatingPost,
    error,
    refreshContent,
    setActiveTab,
    createPost,
    handleLike,
    handleBookmark,
    isPostLiked,
    isPostBookmarked,
  } = useEnhancedHomeViewModel();

  const [toast, setToast] = useState<{message: string; type: ToastType; visible: boolean}>({
    message: '',
    type: 'success',
    visible: false
  });

  useFocusEffect(
    useCallback(() => {
      const switchTab = async () => {
        await setActiveTab(type);
      };
      switchTab();
    }, [setActiveTab, type])
  );

  const showToastMessage = useCallback((message: string, type: ToastType = 'success') => {
    setToast({ message, type, visible: true });
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({...prev, visible: false}));
  }, []);

  const handleComment = useCallback((postId: string) => {
    const post = posts.find(p => p.id === postId);
    navigation.navigate('PostDetails', { postId, post });
  }, [navigation, posts]);

  const handleUserProfile = useCallback((userId: string, userName?: string) => {
    navigation.navigate('UserProfile', { userId, userName });
  }, [navigation]);
  
  const renderHeader = useCallback(() => (
    <CreatePost 
      isCreatingPost={isCreatingPost}
      onCreatePost={createPost}
      onSuccess={() => showToastMessage("Gönderiniz başarıyla paylaşıldı!", "success")}
      onError={() => showToastMessage("Gönderi paylaşılamadı. Tekrar deneyin.", "error")}
    />
  ), [isCreatingPost, createPost, showToastMessage]);

  // Optimized renderPost with reduced animations for better performance
  const renderPost = useCallback(({ item, index }: { item: any; index: number }) => (
    <PostCard
      item={item}
      onLike={handleLike}
      onComment={handleComment}
      onBookmark={handleBookmark}
      onUserPress={handleUserProfile}
      isLiked={isPostLiked(item.id)}
      isBookmarked={isPostBookmarked(item.id)}
      showMoodCompatibility={type === 'forYou'}
    />
  ), [handleLike, handleComment, handleBookmark, handleUserProfile, isPostLiked, isPostBookmarked, type]);

  // FlatList optimization props
  const getItemLayout = useCallback(
    (data: any, index: number) => ({
      length: 200, // Approximate item height
      offset: 200 * index,
      index,
    }),
    []
  );

  const keyExtractor = useCallback((item: any) => item.id, []);

  if (isLoading && posts.length === 0) {
    return (
      <View style={styles.center}>
        <LoadingSpinner size="large" />
        <Text style={styles.loadingText}>Gönderiler yükleniyor...</Text>
      </View>
    );
  }

  if (error && posts.length === 0) {
    return (
      <View style={styles.center}>
        <EmptyState
          icon="alert-circle-outline"
          title="Bir hata oluştu"
          description={error}
        />
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={refreshContent}
        >
          <Text style={styles.retryText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
    <FlatList
      data={posts}
      renderItem={renderPost}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      contentContainerStyle={styles.listContainer}
      onRefresh={refreshContent}
      refreshing={isRefreshing}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={type === 'forYou' ? renderHeader : null}
      ListEmptyComponent={
        !isRefreshing ? (
          <EmptyState
            icon="document-text-outline"
            title="Henüz gönderi yok"
            description="İlk gönderiyi paylaşan siz olun!"
          />
        ) : null
      }
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      initialNumToRender={5}
      windowSize={10}
      />
      
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        duration={3000}
        onHide={hideToast}
      />
        </View>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  listContainer: {
    padding: 12,
    paddingBottom: 100,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.background,
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
      color: theme.mutedForeground,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: theme.primary,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontWeight: '600',
  },
}); 