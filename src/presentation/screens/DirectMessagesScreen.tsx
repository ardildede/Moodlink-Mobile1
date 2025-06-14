import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import useChatListViewModel from '../viewmodels/useChatListViewModel';
import { UserChatItem } from '../../core/domain/entities/Chat';

type MessagesStackParamList = {
  MessageList: undefined;
  Conversation: {
    chatId?: string;
    recipientUserId?: string | null;
    recipientUserName: string;
  };
  NewConversation: undefined;
};

type DirectMessagesNavigationProp = StackNavigationProp<MessagesStackParamList, 'MessageList'>;

const ChatListItem = ({ chat, onPress }: { chat: UserChatItem, onPress: () => void }) => {
  const { theme } = useTheme();
  const lastMessageTime = chat.lastMessage ? new Date(chat.lastMessage.sentAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <TouchableOpacity onPress={onPress} style={[styles.chatItem, { borderBottomColor: theme.border }]}>
      <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
        <Text style={[styles.avatarText, { color: theme.primaryForeground }]}>
          {chat.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.chatInfo}>
        <Text style={[styles.chatName, { color: theme.foreground }]}>{chat.name}</Text>
        {chat.lastMessage && (
          <Text style={[styles.lastMessage, { color: theme.mutedForeground }]} numberOfLines={1}>
            {chat.lastMessage.senderName}: {chat.lastMessage.content}
          </Text>
        )}
      </View>
      <View style={styles.chatMeta}>
        <Text style={[styles.lastMessageTime, { color: theme.mutedForeground }]}>{lastMessageTime}</Text>
        {chat.unreadCount > 0 && (
          <View style={[styles.unreadBadge, { backgroundColor: theme.primary }]}>
            <Text style={[styles.unreadText, { color: theme.primaryForeground }]}>{chat.unreadCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const DirectMessagesScreen = () => {
  const navigation = useNavigation<DirectMessagesNavigationProp>();
  const { theme } = useTheme();
  const { chats, isLoading, error, refresh } = useChatListViewModel();

  const handleNewChat = () => {
    navigation.navigate('NewConversation');
  };
  
  const handleChatPress = (chat: UserChatItem) => {
    navigation.navigate('Conversation', {
      chatId: chat.id,
      recipientUserId: null,
      recipientUserName: chat.name,
    });
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="chatbubbles-outline" size={80} color={theme.mutedForeground} />
      <Text style={[styles.emptyTitle, { color: theme.foreground }]}>Henüz Mesaj Yok</Text>
      <Text style={[styles.emptySubtitle, { color: theme.mutedForeground }]}>
        Yeni bir sohbet başlatarak arkadaşlarınla konuşmaya başla.
      </Text>
      <TouchableOpacity onPress={handleNewChat} style={[styles.emptyButton, { backgroundColor: theme.primary }]}>
        <Text style={[styles.emptyButtonText, { color: theme.primaryForeground }]}>Yeni Sohbet Başlat</Text>
      </TouchableOpacity>
    </View>
  );

  const renderErrorComponent = () => (
    <View style={styles.errorContainer}>
      <Ionicons name="warning-outline" size={60} color={theme.destructive} />
      <Text style={[styles.errorTitle, { color: theme.destructive }]}>Bir Hata Oluştu</Text>
      <Text style={[styles.errorMessage, { color: theme.mutedForeground }]}>
        {error}
      </Text>
      <TouchableOpacity onPress={refresh} style={[styles.retryButton, { backgroundColor: theme.primary }]}>
        <Ionicons name="refresh" size={20} color={theme.primaryForeground} />
        <Text style={[styles.retryButtonText, { color: theme.primaryForeground }]}>Tekrar Dene</Text>
      </TouchableOpacity>
    </View>
  );

  if (error && !isLoading && chats.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        {renderErrorComponent()}
        <TouchableOpacity style={[styles.fab, { backgroundColor: theme.primary }]} onPress={handleNewChat}>
            <Ionicons name="create-outline" size={30} color={theme.primaryForeground} />
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <FlatList
            data={chats}
            renderItem={({ item }) => <ChatListItem chat={item} onPress={() => handleChatPress(item)} />}
            keyExtractor={item => item.id}
            refreshControl={
              <RefreshControl 
                refreshing={isLoading} 
                onRefresh={refresh} 
                colors={[theme.primary]} 
                tintColor={theme.primary}
              />
            }
            ListEmptyComponent={!isLoading && !error ? renderEmptyComponent : null}
            contentContainerStyle={{ flexGrow: 1 }}
        />
        {isLoading && chats.length === 0 && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={[styles.loadingText, { color: theme.mutedForeground }]}>
              Sohbetler yükleniyor...
            </Text>
          </View>
        )}
        
        <TouchableOpacity style={[styles.fab, { backgroundColor: theme.primary }]} onPress={handleNewChat}>
            <Ionicons name="create-outline" size={30} color={theme.primaryForeground} />
        </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    chatItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, },
    avatar: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 15, },
    avatarText: { fontSize: 18, fontWeight: 'bold', },
    chatInfo: { flex: 1, marginRight: 10, },
    chatName: { fontSize: 16, fontWeight: '600', marginBottom: 4, },
    lastMessage: { fontSize: 14, },
    chatMeta: { alignItems: 'flex-end', },
    lastMessageTime: { fontSize: 12, marginBottom: 8, },
    unreadBadge: { minWidth: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 6, },
    unreadText: { fontSize: 12, fontWeight: 'bold', },
    fab: { position: 'absolute', right: 20, bottom: 20, width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowOpacity: 0.3, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, },
    emptyTitle: { fontSize: 22, fontWeight: 'bold', marginTop: 20, },
    emptySubtitle: { fontSize: 16, textAlign: 'center', marginTop: 10, lineHeight: 22, },
    emptyButton: { marginTop: 30, paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25, },
    emptyButtonText: { fontSize: 16, fontWeight: 'bold', },
    loadingContainer: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.8)', },
    loadingText: { marginTop: 10, fontSize: 16, },
    errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, },
    errorTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 16, },
    errorMessage: { fontSize: 16, marginTop: 8, textAlign: 'center', lineHeight: 22, },
    retryButton: { flexDirection: 'row', alignItems: 'center', marginTop: 20, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, },
    retryButtonText: { fontSize: 16, fontWeight: 'bold', marginLeft: 8, },
});

export { DirectMessagesScreen };