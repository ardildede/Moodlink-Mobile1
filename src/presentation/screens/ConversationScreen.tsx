import React, { useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { useAuthStore } from '../stores/authStore';
import { Message } from '../../core/domain/entities/Message';
import { useToast, Toast } from '../components/common/Toast';
import useConversationViewModel from '../viewmodels/useConversationViewModel';

// Helper function to format time
const formatTime = (date: Date | string) => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      return '--:--';
    }
    return dateObj.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    return '--:--';
  }
};

const MessageBubble = React.memo(({ message, isMyMessage, theme }: { message: Message, isMyMessage: boolean, theme: any }) => (
  <View
    style={[
      styles.messageContainer,
      isMyMessage 
        ? [styles.myMessage, { backgroundColor: theme.primary }] 
        : [styles.otherMessage, { backgroundColor: theme.card }],
    ]}
  >
    <Text style={[styles.messageText, { color: isMyMessage ? theme.primaryForeground : theme.foreground }]}>
      {message.content}
    </Text>
    <Text style={[styles.messageTime, { color: isMyMessage ? theme.primaryForeground : theme.mutedForeground, opacity: 0.8 }]}>
      {formatTime(message.sentAt)}
    </Text>
  </View>
));



export const ConversationScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { user } = useAuthStore();
  const { toast, showError, hideToast } = useToast();
  
  // STABILIZE ROUTE PARAMS - This is the key fix!
  const stableParams = useMemo(() => {
    const { recipientUserId, recipientUserName, chatId } = route.params;
    return {
      recipientUserId,
      recipientUserName,
      initialChatId: chatId,
    };
  }, [route.params.recipientUserId, route.params.recipientUserName, route.params.chatId]);

  // Reduced logging for performance
  if (__DEV__) {
    console.log('ConversationScreen', { 
      chatId: stableParams.initialChatId ? 'exists' : 'null',
      recipientId: stableParams.recipientUserId ? 'exists' : 'null',
    });
  }

  // Use the ViewModel hook with stable params
  const {
    messages,
    chatId,
    isLoading,
    isSending,
    error,
    hasMore,
    messageText,
    setMessageText,
    handleSendMessage,
    loadMoreMessages,
    clearError,
  } = useConversationViewModel(stableParams.initialChatId, stableParams.recipientUserId, stableParams.recipientUserName);

  const canSendMessage = useMemo(() => 
    messageText.trim().length > 0 && !isSending, 
    [messageText, isSending]
  );

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const renderHeader = useCallback(() => (
    <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
      <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={theme.primary} />
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { color: theme.foreground }]}>{stableParams.recipientUserName}</Text>
      <View style={{width: 24}} />
    </View>
  ), [theme, stableParams.recipientUserName, handleGoBack]);

  const renderEmptyState = useCallback(() => (
    <View style={styles.emptyStateContainer}>
      <View style={[styles.emptyIconContainer, { backgroundColor: theme.muted }]}>
        <Ionicons name="chatbubbles-outline" size={48} color={theme.mutedForeground} />
      </View>
      <Text style={[styles.emptyStateTitle, { color: theme.foreground }]}>
        Konuşma Başlasın
      </Text>
      <Text style={[styles.emptyStateSubtitle, { color: theme.mutedForeground }]}>
        {stableParams.recipientUserName} ile ilk mesajınızı gönderin
      </Text>
    </View>
  ), [theme, stableParams.recipientUserName]);

  // Toast için hata gösterimi
  React.useEffect(() => {
    if (error) {
      showError(error);
      clearError();
    }
  }, [error, showError, clearError]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {renderHeader()}
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.messagesContainer}>
          {isLoading && messages.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.primary} />
              <Text style={[styles.loadingText, { color: theme.mutedForeground }]}>
                Mesajlar yükleniyor...
              </Text>
            </View>
          ) : (
            <FlatList
              data={messages || []}
              renderItem={({ item }) => (
                <MessageBubble message={item} isMyMessage={item.senderId === user?.id} theme={theme} />
              )}
              keyExtractor={item => item.id}
              inverted
              contentContainerStyle={styles.messagesList}
              onEndReached={loadMoreMessages}
              onEndReachedThreshold={0.5}
              ListEmptyComponent={renderEmptyState}
              showsVerticalScrollIndicator={false}
              removeClippedSubviews={true}
              maxToRenderPerBatch={10}
              windowSize={10}
              initialNumToRender={20}
              keyboardShouldPersistTaps="handled"
            />
          )}
        </View>
        
        <View style={[styles.inputContainer, { borderTopColor: theme.border, backgroundColor: theme.background }]}>
          <View style={[styles.inputWrapper]}>
            <View style={styles.inputTextContainer}>
              <TextInput
                style={[styles.messageInput, { 
                  borderColor: theme.border, 
                  color: theme.foreground, 
                  backgroundColor: theme.background 
                }]}
                value={messageText}
                onChangeText={setMessageText}
                placeholder="Mesaj yazın..."
                placeholderTextColor={theme.mutedForeground}
                multiline
                maxLength={1000}
                textAlignVertical="top"
              />
            </View>
            <TouchableOpacity
              style={[styles.sendButton, { 
                backgroundColor: canSendMessage ? '#3B82F6' : '#D1D5DB' 
              }]}
              onPress={handleSendMessage}
              disabled={!canSendMessage}
            >
              {isSending ? (
                <ActivityIndicator size="small" color={canSendMessage ? 'white' : '#9CA3AF'} />
              ) : (
                <Ionicons name="send" size={20} color={canSendMessage ? 'white' : '#9CA3AF'} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
      
      {/* Toast Bildirimi */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        duration={3000}
        onHide={hideToast}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  messagesContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  messagesList: {
    paddingVertical: 10,
    flexGrow: 1,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  messageContainer: {
    marginVertical: 5,
    marginHorizontal: 12,
    maxWidth: '80%',
    borderRadius: 18,
    padding: 12,
  },
  myMessage: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 12 : 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  inputTextContainer: {
    flex: 1,
  },
  messageInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 96,
    minHeight: 48,
  },
  sendButton: {
    padding: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 