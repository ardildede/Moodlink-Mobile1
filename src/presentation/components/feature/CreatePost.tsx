import React, { useState, useCallback } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Text
} from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  runOnUI
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface CreatePostProps {
  isCreatingPost: boolean;
  onCreatePost: (content: string) => Promise<boolean>;
  onSuccess: () => void;
  onError: () => void;
}

export const CreatePost: React.FC<CreatePostProps> = React.memo(({
  isCreatingPost,
  onCreatePost,
  onSuccess,
  onError,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [postContent, setPostContent] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const submitScale = useSharedValue(1);

  const handleTextChange = useCallback((text: string) => {
    setPostContent(text);
    if (localError) setLocalError(null);
  }, [localError]);

  const handlePostSubmit = useCallback(async () => {
    if (!postContent.trim()) {
      setLocalError("Gönderi içeriği boş olamaz");
      return;
    }
    setLocalError(null);

    // Simplified submit animation
    runOnUI(() => {
      submitScale.value = withSpring(1.1, { damping: 20, stiffness: 300 }, () => {
        submitScale.value = withSpring(1, { damping: 20, stiffness: 300 });
      });
    })();

    const success = await onCreatePost(postContent);
    if (success) {
      setPostContent('');
      onSuccess();
    } else {
      onError();
    }
  }, [postContent, onCreatePost, onSuccess, onError, submitScale]);
  
  const submitAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: submitScale.value }],
  }), []);

  return (
    <View style={styles.createPostContainer}>
      <View style={styles.textInputWrapper}>
        <TextInput
          placeholder="Neler oluyor?"
          placeholderTextColor={theme.mutedForeground}
          style={styles.textInput}
          value={postContent}
          onChangeText={handleTextChange}
          multiline
          maxLength={500}
        />
        {localError && (
          <Text style={styles.errorText}>{localError}</Text>
        )}
        <View style={styles.createPostActions}>
          <View style={styles.leftActions}>
            <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
              <Ionicons name="image-outline" size={24} color={theme.primary} />
            </TouchableOpacity>
            <Text style={styles.charCount}>
              {postContent.length}/500
            </Text>
          </View>
          
          <Animated.View style={submitAnimatedStyle}>
            <TouchableOpacity
              style={[
                styles.submitButton, 
                (!postContent.trim() || isCreatingPost) && styles.submitButtonDisabled
              ]}
              disabled={!postContent.trim() || isCreatingPost}
              onPress={handlePostSubmit}
              activeOpacity={0.8}
            >
              {isCreatingPost ? (
                <LoadingSpinner size="small" color="white" />
              ) : (
                <Text style={styles.submitButtonText}>Paylaş</Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </View>
  );
});

CreatePost.displayName = 'CreatePost';

const getStyles = (theme: any) => StyleSheet.create({
    createPostContainer: {
        padding: 16,
        backgroundColor: theme.card,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: theme.border,
        shadowColor: theme.foreground,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      },
      textInputWrapper: {
        width: '100%',
      },
      textInput: {
        minHeight: 100,
        fontSize: 16,
        color: theme.foreground,
        textAlignVertical: 'top',
        padding: 16,
        backgroundColor: theme.muted,
        borderRadius: 12,
        marginBottom: 12,
      },
      createPostActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      leftActions: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      iconButton: {
        padding: 8,
        marginRight: 12,
      },
      charCount: {
        fontSize: 12,
        color: theme.mutedForeground,
      },
      submitButton: {
        backgroundColor: theme.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 24,
        minWidth: 80,
        alignItems: 'center',
        justifyContent: 'center',
      },
      submitButtonDisabled: {
        opacity: 0.5,
      },
      submitButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
      },
      errorText: {
        color: theme.destructive,
        fontSize: 12,
        marginBottom: 8,
        marginLeft: 4,
      },
}); 