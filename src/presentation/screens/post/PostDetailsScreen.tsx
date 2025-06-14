import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import { PostCard } from '../../components/feature/PostCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { usePostDetailsViewModel } from '../../viewmodels/post/usePostDetailsViewModel';
import { Comment } from '../../../core/domain/entities/Comment';
import { formatRelativeTime } from '../../../common/utils/dateUtils';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export function PostDetailsScreen() {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation<NavigationProp>();

  const {
    post,
    comments,
    isLoading,
    error,
    commentText,
    isSubmittingComment,
    setCommentText,
    handleCommentSubmit,
    handleLike,
    loadPostDetails,
  } = usePostDetailsViewModel();

  const handleUserProfile = (userId: string) => {
    navigation.navigate('UserProfile', { userId });
  };

  const renderComment = ({ item }: { item: Comment }) => {
    const displayName = item.user?.firstName && item.user?.lastName
      ? `${item.user.firstName} ${item.user.lastName}`
      : item.user?.userName || 'Kullanıcı';
    
    const userName = item.user?.userName || 'kullanici';

    return (
      <View style={styles.commentContainer}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentUser}>{displayName}</Text>
          <Text style={styles.commentDate}>{formatRelativeTime(item.createdAt)}</Text>
        </View>
        <Text style={styles.commentHandle}>@{userName}</Text>
        <Text style={styles.commentContent}>{item.content}</Text>
      </View>
    );
  };

  const renderHeader = () => (
    <>
      {post && (
        <PostCard
          item={post}
          onLike={handleLike}
          onComment={() => {}} // Already on details screen
          onBookmark={() => {}} // Placeholder
          onUserPress={() => handleUserProfile(post.user.id)}
          isLiked={post.isLiked || false}
          isBookmarked={false} // Placeholder
          showMoodCompatibility={false}
        />
      )}
      <View style={styles.commentsTitleContainer}>
        <Text style={styles.commentsTitle}>Yorumlar ({comments.length})</Text>
      </View>
    </>
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <LoadingSpinner size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadPostDetails}>
          <Text style={styles.retryButtonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={90}
    >
      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Yorumunuzu yazın..."
          placeholderTextColor={theme.mutedForeground}
          value={commentText}
          onChangeText={setCommentText}
        />
        <TouchableOpacity
          style={[styles.submitButton, isSubmittingComment && styles.disabledButton]}
          onPress={handleCommentSubmit}
          disabled={isSubmittingComment}
        >
          {isSubmittingComment ? (
            <LoadingSpinner size="small" color={theme.primaryForeground} />
          ) : (
            <Ionicons name="send" size={24} color={theme.primaryForeground} />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: theme.destructive,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: theme.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  retryButtonText: {
    color: theme.primaryForeground,
    fontSize: 16,
    fontWeight: 'bold',
  },
  commentsTitleContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.foreground,
  },
  commentContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  commentUser: {
    fontWeight: 'bold',
    color: theme.foreground,
  },
  commentDate: {
    color: theme.mutedForeground,
    fontSize: 12,
  },
  commentHandle: {
    color: theme.mutedForeground,
    fontSize: 12,
  },
  commentContent: {
    color: theme.foreground,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    backgroundColor: theme.card,
  },
  input: {
    flex: 1,
    backgroundColor: theme.input,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    color: theme.foreground,
  },
  submitButton: {
    backgroundColor: theme.primary,
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
}); 