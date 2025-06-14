import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import { Comment } from '../../../core/domain/entities/Comment';
import { useAuthStore } from '../../stores/authStore';
import { GetCommentsUseCase } from '../../../core/domain/usecases/comment/GetCommentsUseCase';
import { CreateCommentUseCase } from '../../../core/domain/usecases/comment/CreateCommentUseCase';
import { LikeUseCase } from '../../../core/domain/usecases/like/LikeUseCase';
import { UnlikeCommentUseCase } from '../../../core/domain/usecases/like/UnlikeCommentUseCase';
import { CommentRepositoryImpl } from '../../../core/data/repositories/CommentRepositoryImpl';
import { LikeRepositoryImpl } from '../../../core/data/repositories/LikeRepositoryImpl';
import CommentApi from '../../../core/data/datasources/remote/CommentApi';
import LikeApi from '../../../core/data/datasources/remote/LikeApi';
import { CommentCard } from './CommentCard';
import { EmptyState } from '../common/EmptyState';

// Instantiate dependencies
const commentRepository = new CommentRepositoryImpl(CommentApi);
const likeRepository = new LikeRepositoryImpl(LikeApi);
const getCommentsUseCase = new GetCommentsUseCase(commentRepository);
const createCommentUseCase = new CreateCommentUseCase(commentRepository);
const likeUseCase = new LikeUseCase(likeRepository);
const unlikeCommentUseCase = new UnlikeCommentUseCase(likeRepository);

interface CommentSectionProps {
  postId: string | null;
  onClose: () => void;
  onCommentCreated: () => void;
  visible: boolean;
  onCommentCountChange: (count: number) => void;
}

export const CommentSection = React.memo<CommentSectionProps>(({
  visible,
  onClose,
  postId,
  onCommentCreated,
  onCommentCountChange
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { user } = useAuthStore();

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [commentLikeIds, setCommentLikeIds] = useState<Map<string, string>>(new Map());

  const fetchComments = useCallback(async () => {
    if (!postId) return;
    setIsLoading(true);
    try {
      const fetchedComments = await getCommentsUseCase.execute({ postId });
      setComments(fetchedComments);
      onCommentCountChange(fetchedComments.length);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setIsLoading(false);
    }
  }, [postId, onCommentCountChange]);

  useEffect(() => {
    if (visible && postId) {
      fetchComments();
    }
  }, [visible, postId, fetchComments]);
  
  const handlePostComment = async () => {
    if (!newComment.trim() || !postId || !user?.id) return;
    setIsPosting(true);
    try {
      const created = await createCommentUseCase.execute(user.id, postId, newComment.trim());
      setComments(prev => [created, ...prev]);
      setNewComment('');
      onCommentCreated();
    } catch (error) {
      console.error("Failed to post comment:", error);
    } finally {
      setIsPosting(false);
    }
  };
  
  const handleLikeComment = async (commentId: string) => {
    if(!user?.id) return;

    const isCurrentlyLiked = likedComments.has(commentId);
    const likeId = commentLikeIds.get(commentId);

    setLikedComments(prev => {
        const newSet = new Set(prev);
        if(isCurrentlyLiked) newSet.delete(commentId);
        else newSet.add(commentId);
        return newSet;
    });
    setComments(prev => prev.map(c => c.id === commentId ? {...c, likes: (c.likes || 0) + (isCurrentlyLiked ? -1 : 1)} : c));

    try {
        if(isCurrentlyLiked) {
            if(likeId) {
                await likeUseCase.unlikeEntity(likeId);
            } else {
                await unlikeCommentUseCase.execute(user.id, commentId);
            }
        } else {
            const newLike = await likeUseCase.likeComment(user.id, commentId);
            if(newLike?.id) {
                setCommentLikeIds(prev => new Map(prev).set(commentId, newLike.id));
            }
        }
    } catch (error) {
        console.error("Failed to like/unlike comment:", error);
        // Revert optimistic update
        setLikedComments(prev => {
            const newSet = new Set(prev);
            if(isCurrentlyLiked) newSet.add(commentId);
            else newSet.delete(commentId);
            return newSet;
        });
        setComments(prev => prev.map(c => c.id === commentId ? {...c, likes: (c.likes || 0) + (isCurrentlyLiked ? 1 : -1)} : c));
    }
  };

  const EmptyComments = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
      <Ionicons name="chatbubble-outline" size={64} color="#9CA3AF" />
      <Text style={{ color: '#6B7280', fontSize: 18, marginTop: 16, textAlign: 'center' }}>
        İlk yorumu sen yaz
      </Text>
      <Text style={{ color: '#9CA3AF', fontSize: 14, marginTop: 8, textAlign: 'center' }}>
        Bu gönderiye ilk yorum yapan sen ol
      </Text>
    </View>
  );

  return (
    <Modal
      visible={visible && !!postId}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
      transparent={false}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
          <TouchableOpacity onPress={onClose} style={{ padding: 8 }}>
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827' }}>
            Yorumlar
          </Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Comments List */}
        <View style={{ flex: 1 }}>
          {isLoading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: '#6B7280' }}>Yorumlar yükleniyor...</Text>
            </View>
          ) : comments.length === 0 ? (
            <EmptyComments />
          ) : (
            <FlatList
              data={comments}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <CommentCard
                  comment={item}
                  onLike={() => handleLikeComment(item.id)}
                  isLiked={likedComments.has(item.id)}
                />
              )}
              contentContainerStyle={{ paddingVertical: 8 }}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>

        {/* Comment Input */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <View style={{ borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, backgroundColor: 'white' }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <TextInput
                  value={newComment}
                  onChangeText={setNewComment}
                  placeholder="Yorumunuzu yazın..."
                  multiline
                  maxLength={500}
                  style={{ 
                    borderWidth: 1, 
                    borderColor: '#E5E7EB', 
                    borderRadius: 12, 
                    paddingHorizontal: 16, 
                    paddingVertical: 12, 
                    maxHeight: 96, 
                    color: '#111827' 
                  }}
                  textAlignVertical="top"
                />
              </View>
              <TouchableOpacity
                onPress={handlePostComment}
                disabled={!newComment.trim() || isPosting}
                style={{
                  padding: 12,
                  borderRadius: 12,
                  backgroundColor: newComment.trim() && !isPosting ? '#3B82F6' : '#D1D5DB'
                }}
              >
                <Ionicons
                  name="send"
                  size={20}
                  color={newComment.trim() && !isPosting ? 'white' : '#9CA3AF'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
});

CommentSection.displayName = 'CommentSection';

const getStyles = (theme: any) => StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  contentContainer: {
    height: '85%',
    backgroundColor: theme.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.foreground,
  },
  closeButton: {
      position: 'absolute',
      right: 16,
  },
  list: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    backgroundColor: theme.card
  },
  input: {
    flex: 1,
    backgroundColor: theme.muted,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: theme.foreground,
    marginRight: 12,
  },
  postButton: {
    backgroundColor: theme.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  }
}); 