import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  runOnUI
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import { Post } from '../../../core/domain/entities/Post';
import { formatRelativeTime } from '../../../common/utils/dateUtils';

interface PostCardProps {
  item: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onBookmark?: (postId: string) => void;
  onUserPress?: (userId: string, userName?: string) => void;
  isLiked?: boolean;
  isBookmarked?: boolean;
  showMoodCompatibility?: boolean;
}

export const PostCard = React.memo<PostCardProps>(({
  item,
  onLike,
  onComment,
  onShare,
  onBookmark,
  onUserPress,
  isLiked = false,
  isBookmarked = false,
  showMoodCompatibility = false
}) => {
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);
  
  // Simplified animations - only for important interactions
  const likeScale = useSharedValue(1);
  const bookmarkScale = useSharedValue(1);

  // Memoized calculated values
  const formattedDate = useMemo(() => {
    return formatRelativeTime(item.createdDate);
  }, [item.createdDate]);

  const avatarText = useMemo(() => {
    return item.user?.firstName?.[0]?.toUpperCase() || 
           item.user?.userName?.[0]?.toUpperCase() || 
           'U';
  }, [item.user?.firstName, item.user?.userName]);

  const displayName = useMemo(() => {
    return item.user?.firstName && item.user?.lastName 
      ? `${item.user.firstName} ${item.user.lastName}` 
      : item.user?.userName || 'Kullanıcı';
  }, [item.user?.firstName, item.user?.lastName, item.user?.userName]);

  const userName = useMemo(() => {
    return item.user?.userName || 'kullanici';
  }, [item.user?.userName]);

  const moodCompatibilityValue = useMemo(() => {
    if (showMoodCompatibility && item.moodCompatibility !== undefined) {
      return Math.round(parseFloat(item.moodCompatibility));
    }
    return null;
  }, [item.moodCompatibility, showMoodCompatibility]);

  // Mood compatibility renk ve ikon hesaplaması
  const getMoodColor = useCallback((value: number) => {
    if (value >= 80) return '#10B981'; // Yeşil - Çok uyumlu
    if (value >= 50) return '#F59E0B'; // Sarı - Orta uyumlu
    return '#6B7280'; // Gri - Az uyumlu
  }, []);

  const getMoodIcon = useCallback((value: number) => {
    if (value >= 80) return 'heart';
    if (value >= 50) return 'heart-half';
    return 'heart-outline';
  }, []);

  const getMoodText = useCallback((value: number) => {
    if (value >= 80) return 'Çok Uyumlu';
    if (value >= 50) return 'Uyumlu';
    return 'Az Uyumlu';
  }, []);

  // Direct handlers - keyboardShouldPersistTaps will handle the touch issues
  const handleLikePress = useCallback(() => onLike?.(item.id), [onLike, item.id]);
  const handleCommentPress = useCallback(() => onComment?.(item.id), [onComment, item.id]);
  const handleBookmarkPress = useCallback(() => onBookmark?.(item.id), [onBookmark, item.id]);
  const handleUserPressAction = useCallback(() => onUserPress?.(item.userId, item.user?.userName), [onUserPress, item.userId, item.user?.userName]);

  // Simplified animated styles
  const likeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: likeScale.value }],
  }), []);

  const bookmarkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bookmarkScale.value }],
  }), []);

  const handleLike = useCallback(() => {
    runOnUI(() => {
      'worklet';
      likeScale.value = withSpring(0.8, { duration: 100 }, () => {
        likeScale.value = withSpring(1, { duration: 100 });
      });
    })();
    handleLikePress();
  }, [handleLikePress]);

  const handleComment = useCallback(() => {
    handleCommentPress();
  }, [handleCommentPress]);

  const handleShare = useCallback(() => {
    Alert.alert('Paylaş', 'Bu özellik yakında gelecek!');
  }, []);

  const handleBookmark = useCallback(() => {
    runOnUI(() => {
      'worklet';
      bookmarkScale.value = withSpring(0.8, { duration: 100 }, () => {
        bookmarkScale.value = withSpring(1, { duration: 100 });
      });
    })();
    handleBookmarkPress();
  }, [handleBookmarkPress]);

  const handleUserPress = useCallback(() => {
    handleUserPressAction();
  }, [handleUserPressAction]);

  return (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <TouchableOpacity onPress={handleUserPress} activeOpacity={0.6}>
          <LinearGradient
            colors={[theme.primary, theme.ring]}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>
              {avatarText}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        <View style={styles.userInfo}>
          <TouchableOpacity onPress={handleUserPress} activeOpacity={0.6}>
            <Text style={styles.username}>
              {displayName}
            </Text>
            <Text style={styles.handle}>@{userName}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>
            {formattedDate}
          </Text>
        </View>
      </View>
      
      <Text style={styles.postText}>{item.contentText}</Text>
      
      {showMoodCompatibility && moodCompatibilityValue && (
        <View style={styles.moodCompatibilityContainer}>
          <View style={styles.moodIconContainer}>
            <Ionicons name={getMoodIcon(moodCompatibilityValue)} size={16} color={getMoodColor(moodCompatibilityValue)} />
          </View>
          <View style={styles.moodInfoContainer}>
            <Text style={[styles.moodCompatibilityText, { color: getMoodColor(moodCompatibilityValue) }]}>
              {getMoodText(moodCompatibilityValue)}
            </Text>
            <Text style={[styles.moodPercentageText, { color: getMoodColor(moodCompatibilityValue) }]}>
              %{moodCompatibilityValue}
            </Text>
          </View>
        </View>
      )}
      
      <View style={styles.postActions}>
        <Animated.View style={likeAnimatedStyle}>
          <TouchableOpacity 
            style={[styles.actionButton, isLiked && styles.likedButton]} 
            onPress={handleLike}
            activeOpacity={0.6}
          >
            <Ionicons 
              name={isLiked ? "heart" : "heart-outline"} 
              size={20} 
              color={isLiked ? "#EF4444" : theme.mutedForeground} 
            />
            <Text style={[
              styles.actionText, 
              isLiked && styles.likedText
            ]}>
              {item.likesCount ?? 0}
            </Text>
          </TouchableOpacity>
        </Animated.View>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={handleComment}
          activeOpacity={0.6}
        >
          <Ionicons 
            name="chatbubble-outline" 
            size={20} 
            color={theme.mutedForeground} 
          />
          <Text style={styles.actionText}>{item.commentsCount ?? 0}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={handleShare}
          activeOpacity={0.6}
        >
          <Ionicons 
            name="arrow-redo-outline" 
            size={20} 
            color={theme.mutedForeground} 
          />
        </TouchableOpacity>
        
        <Animated.View style={bookmarkAnimatedStyle}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleBookmark}
            activeOpacity={0.6}
          >
            <Ionicons 
              name={isBookmarked ? "bookmark" : "bookmark-outline"} 
              size={20} 
              color={isBookmarked ? theme.primary : theme.mutedForeground} 
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
});

PostCard.displayName = 'PostCard';

const getStyles = (theme: any) => StyleSheet.create({
  postCard: {
    backgroundColor: theme.card,
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.border,
    shadowColor: theme.foreground,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontWeight: "700",
    fontSize: 15,
    color: theme.foreground,
    marginBottom: 2,
  },
  handle: {
    fontSize: 13,
    color: theme.mutedForeground,
  },
  timeContainer: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    backgroundColor: theme.muted,
    borderRadius: 6,
  },
  timeText: {
    fontSize: 11,
    color: theme.mutedForeground,
    fontWeight: '500',
  },
  postText: {
    fontSize: 15,
    color: theme.foreground,
    lineHeight: 22,
    marginBottom: 14,
  },
  postActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  likedButton: {
    backgroundColor: '#FEF2F2',
  },
  actionText: {
    marginLeft: 6,
    fontSize: 13,
    color: theme.mutedForeground,
    fontWeight: '500',
  },
  likedText: {
    color: '#EF4444',
  },
  moodCompatibilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.muted,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.border,
  },
  moodIconContainer: {
    marginRight: 8,
  },
  moodInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  moodCompatibilityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  moodPercentageText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.mutedForeground,
  },
}); 