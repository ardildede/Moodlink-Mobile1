import React, { useState, useRef } from 'react';
import { 
  View, 
  Text,
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSpring,
  runOnUI
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface CommentInputProps {
  visible: boolean;
  onSubmit: (comment: string) => void;
  onClose: () => void;
  isLoading?: boolean;
  placeholder?: string;
}

export const CommentInput: React.FC<CommentInputProps> = ({
  visible,
  onSubmit,
  onClose,
  isLoading = false,
  placeholder = "Yorumunuzu yazın..."
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [comment, setComment] = useState('');
  const inputRef = useRef<TextInput>(null);
  
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);
  const submitScale = useSharedValue(1);

  React.useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, { duration: 250 });
      opacity.value = withTiming(1, { duration: 250 });
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      translateY.value = withTiming(100, { duration: 200 });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }), []);

  const submitAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: submitScale.value }],
  }), []);

  const handleSubmit = () => {
    if (comment.trim() && !isLoading) {
      // Quick submit animation
      runOnUI(() => {
        submitScale.value = withSpring(1.1, { damping: 20, stiffness: 300 }, () => {
          submitScale.value = withSpring(1, { damping: 20, stiffness: 300 });
        });
      })();
      onSubmit(comment.trim());
      setComment('');
    }
  };

  const canSubmit = comment.trim().length > 0 && !isLoading;

  if (!visible) return null;

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.overlay}
    >
      <TouchableOpacity 
        style={styles.backdrop} 
        onPress={onClose}
        activeOpacity={1}
      />
      
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.6}>
            <Ionicons name="close" size={24} color={theme.foreground} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            style={styles.textInput}
            placeholder={placeholder}
            placeholderTextColor={theme.mutedForeground}
            value={comment}
            onChangeText={setComment}
            multiline
            maxLength={280}
            textAlignVertical="top"
          />
          
          <View style={styles.footer}>
            <View style={styles.charCount}>
              <Text style={styles.charCountText}>
                {comment.length}/280
              </Text>
            </View>
            
            <Animated.View style={submitAnimatedStyle}>
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  !canSubmit && styles.submitButtonDisabled
                ]}
                onPress={handleSubmit}
                disabled={!canSubmit}
                activeOpacity={0.6}
              >
                {isLoading ? (
                  <LoadingSpinner size="small" color="white" />
                ) : (
                  <Ionicons name="send" size={16} color="white" />
                )}
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const getStyles = (theme: any) => StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    backgroundColor: theme.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
    maxHeight: '50%',
    minHeight: 200,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    marginBottom: 16,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 8,
    padding: 8,
  },
  inputContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: theme.foreground,
    textAlignVertical: 'top',
    padding: 16,
    backgroundColor: theme.muted,
    borderRadius: 12,
    minHeight: 100,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  charCount: {},
  charCountText: {
    fontSize: 12,
    color: theme.mutedForeground,
  },
  submitButton: {
    backgroundColor: theme.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
}); 