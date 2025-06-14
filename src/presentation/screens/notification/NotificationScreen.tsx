import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNotificationViewModel } from '@/presentation/viewmodels/useNotificationViewModel';
import { Notification } from '@/core/domain/entities/Notification';
import { useTheme } from '@/presentation/theme/ThemeProvider';

const NotificationScreen: React.FC = () => {
  const {
    notifications,
    isLoading,
    isRefreshing,
    error,
    hasMore,
    refreshNotifications,
    loadMoreNotifications,
    getNotificationTypeText,
    getNotificationIcon,
  } = useNotificationViewModel();

  const { theme } = useTheme();

  const renderNotificationItem = useCallback(({ item }: { item: Notification }) => {
    const iconName = getNotificationIcon(item.type) as keyof typeof Ionicons.glyphMap;

    return (
      <View
        style={[
          styles.notificationItem,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
            shadowColor: theme.foreground, // Use a theme-based shadow
          },
          !item.isRead && { borderLeftColor: theme.primary, borderLeftWidth: 3 },
        ]}
      >
        <View style={[styles.iconContainer, { backgroundColor: theme.secondary }]}>
          <Ionicons
            name={iconName}
            size={24}
            color={theme.primary}
          />
        </View>
        <View style={styles.notificationContent}>
          <Text style={[styles.notificationText, { color: theme.foreground }]}>
            {item.content}
          </Text>
          <Text style={[styles.notificationType, { color: theme.mutedForeground }]}>
            {getNotificationTypeText(item.type)}
          </Text>
        </View>
        {!item.isRead && (
          <View style={[styles.unreadDot, { backgroundColor: theme.primary }]} />
        )}
      </View>
    );
  }, [theme, getNotificationIcon, getNotificationTypeText]);

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="notifications-off-outline"
        size={80}
        color={theme.mutedForeground}
      />
      <Text style={[styles.emptyTitle, { color: theme.foreground }]}>
        Henüz bildiriminiz yok
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.mutedForeground }]}>
        Yeni bildirimler burada görünecek.
      </Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.errorContainer}>
      <Ionicons
        name="cloud-offline-outline"
        size={60}
        color={theme.destructive}
      />
      <Text style={[styles.errorTitle, { color: theme.destructive }]}>
        Bir hata oluştu
      </Text>
      <Text style={[styles.errorMessage, { color: theme.mutedForeground }]}>
        {error}
      </Text>
      <TouchableOpacity
        style={[styles.retryButton, { backgroundColor: theme.primary }]}
        onPress={refreshNotifications}
      >
        <Text style={[styles.retryButtonText, { color: theme.primaryForeground }]}>
          Tekrar Dene
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (error && notifications.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        {renderError()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshNotifications}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }
        onEndReached={loadMoreNotifications}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={!isLoading ? renderEmpty : null}
        ListFooterComponent={
          isLoading && hasMore ? (
            <View style={styles.loadingFooter}>
              <ActivityIndicator size="small" color={theme.primary} />
            </View>
          ) : null
        }
        contentContainerStyle={[
          styles.listContent,
          notifications.length === 0 && styles.emptyListContent,
        ]}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  notificationType: {
    fontSize: 13,
    marginTop: 2,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default NotificationScreen; 