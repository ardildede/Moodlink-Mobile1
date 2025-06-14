import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnUI } from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeProvider';
import { Comment } from '../../../core/domain/entities/Comment';
import { formatRelativeTime } from '../../../common/utils/dateUtils';

interface CommentCardProps {
  comment: Comment;
  onLike: (commentId: string) => void;
  isLiked: boolean;
}

export const CommentCard: React.FC<CommentCardProps> = React.memo(({ comment, onLike, isLiked }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const likeScale = useSharedValue(1);

  const handleLike = () => {
    if (!isLiked) {
      // Quick animation only for like (not unlike)
      runOnUI(() => {
        likeScale.value = withSpring(1.15, { damping: 20, stiffness: 300 }, () => {
          likeScale.value = withSpring(1, { damping: 20, stiffness: 300 });
        });
      })();
    }
    onLike(comment.id);
  };

  const animatedLikeStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: likeScale.value }],
    };
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.primary, theme.ring]}
        style={styles.avatar}
      >
        <Text style={styles.avatarText}>{comment.user?.userName?.[0]?.toUpperCase() ?? 'U'}</Text>
      </LinearGradient>
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.username}>{comment.user?.userName ?? 'Kullanıcı'}</Text>
          <Text style={styles.time}>{formatRelativeTime(comment.createdAt)}</Text>
        </View>
        <Text style={styles.commentText}>{comment.content}</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleLike} activeOpacity={0.7}>
            <Animated.View style={animatedLikeStyle}>
              <Ionicons
                name={isLiked ? 'heart' : 'heart-outline'}
                size={18}
                color={isLiked ? theme.destructive : theme.mutedForeground}
              />
            </Animated.View>
            <Text style={[styles.actionText, isLiked && styles.likedText]}>
              {comment.likes ?? 0}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

CommentCard.displayName = 'CommentCard';

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: theme.card,
    fontSize: 16,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontWeight: 'bold',
    color: theme.foreground,
    fontSize: 14,
  },
  time: {
    marginLeft: 8,
    color: theme.mutedForeground,
    fontSize: 12,
  },
  commentText: {
    color: theme.foreground,
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 4,
    color: theme.mutedForeground,
    fontSize: 12,
  },
  likedText: {
    color: theme.destructive,
    fontWeight: 'bold',
  },
}); 