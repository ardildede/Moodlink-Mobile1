import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { useNewConversationViewModel } from '../viewmodels/useNewConversationViewModel';
import { FollowingUser } from '../../core/domain/entities/User';

export const NewConversationScreen = () => {
  const navigation = useNavigation<any>();
  const { theme } = useTheme();
  const { searchTerm, setSearchTerm, filteredUsers, isLoading, error, refresh } = useNewConversationViewModel();

  const handleUserPress = (user: FollowingUser) => {
    navigation.navigate('Conversation', {
      recipientUserId: user.id,
      recipientUserName: `${user.firstName} ${user.lastName}`,
    });
  };

  const renderUserItem = ({ item }: { item: FollowingUser }) => (
    <TouchableOpacity onPress={() => handleUserPress(item)} style={[styles.userItem, { borderBottomColor: theme.border }]}>
      <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
        <Text style={[styles.avatarText, { color: theme.primaryForeground }]}>
          {item.firstName.charAt(0)}{item.lastName.charAt(0)}
        </Text>
      </View>
      <View style={styles.userInfo}>
        <Text style={[styles.fullName, { color: theme.foreground }]}>{item.firstName} {item.lastName}</Text>
        <Text style={[styles.userName, { color: theme.mutedForeground }]}>@{item.userName}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.mutedForeground} />
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={[styles.header, { borderBottomColor: theme.border }]}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="close" size={28} color={theme.foreground} />
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { color: theme.foreground }]}>Yeni Sohbet</Text>
      <View style={{ width: 28 }} />
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorContainer}>
      <Ionicons name="warning-outline" size={60} color={theme.destructive} />
      <Text style={[styles.errorTitle, { color: theme.destructive }]}>Bir Hata Oluştu</Text>
      <Text style={[styles.errorMessage, { color: theme.mutedForeground }]}>
        {error}
      </Text>
      <TouchableOpacity onPress={refresh} style={[styles.retryButton, { backgroundColor: theme.primary }]}>
        <Text style={[styles.retryButtonText, { color: theme.primaryForeground }]}>Tekrar Dene</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="people-outline" size={60} color={theme.mutedForeground} />
      <Text style={[styles.emptyTitle, { color: theme.foreground }]}>
        {searchTerm ? 'Sonuç Bulunamadı' : 'Takip Edilen Kimse Yok'}
      </Text>
      <Text style={[styles.emptyText, { color: theme.mutedForeground }]}>
        {searchTerm 
          ? 'Aradığınız kriterlere uygun kullanıcı bulunamadı.'
          : 'Mesaj gönderebilmek için önce kullanıcıları takip etmelisiniz.'
        }
      </Text>
    </View>
  );

  if (error && !isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        {renderHeader()}
        {renderErrorState()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {renderHeader()}
      <View style={[styles.searchContainer, { borderBottomColor: theme.border }]}>
        <Ionicons name="search" size={20} color={theme.mutedForeground} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: theme.foreground, backgroundColor: theme.card }]}
          placeholder="Kişi ara..."
          placeholderTextColor={theme.mutedForeground}
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.mutedForeground }]}>
            Kullanıcılar yükleniyor...
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredUsers || []}
          renderItem={renderUserItem}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl 
              refreshing={isLoading} 
              onRefresh={refresh} 
              colors={[theme.primary]} 
              tintColor={theme.primary} 
            />
          }
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={{ flexGrow: 1 }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderBottomWidth: 1, },
    backButton: { padding: 5, },
    headerTitle: { fontSize: 18, fontWeight: 'bold', },
    searchContainer: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, },
    searchIcon: { marginRight: 10, },
    searchInput: { flex: 1, height: 40, borderRadius: 10, paddingHorizontal: 15, fontSize: 16, },
    userItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 0.5, },
    avatar: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 15, },
    avatarText: { fontSize: 18, fontWeight: 'bold', },
    userInfo: { flex: 1, },
    fullName: { fontSize: 16, fontWeight: '600', },
    userName: { fontSize: 14, marginTop: 2, },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', },
    loadingText: { marginTop: 10, fontSize: 16, },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, },
    emptyTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 16, textAlign: 'center', },
    emptyText: { fontSize: 16, marginTop: 8, textAlign: 'center', lineHeight: 22, },
    errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, },
    errorTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 16, },
    errorMessage: { fontSize: 16, marginTop: 8, textAlign: 'center', lineHeight: 22, },
    retryButton: { marginTop: 20, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, },
    retryButtonText: { fontSize: 16, fontWeight: 'bold', },
}); 