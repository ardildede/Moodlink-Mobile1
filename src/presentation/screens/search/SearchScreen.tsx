import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import { useSearchViewModel } from '../../viewmodels/useSearchViewModel';
import { RecommendedUser } from '../../../core/domain/entities/RecommendedUser';
import { SearchUser } from '../../../core/domain/entities/SearchResult';

import { DrawerScreenProps } from '@react-navigation/drawer';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DrawerParamList, MainStackParamList } from '../../navigation/types';

type SearchScreenProps = CompositeScreenProps<
  DrawerScreenProps<DrawerParamList, 'Search'>,
  NativeStackScreenProps<MainStackParamList>
>;

export default function SearchScreen({ navigation }: SearchScreenProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { theme } = useTheme();
  const styles = getStyles(theme);
  
  const {
    suggestedUsers,
    searchResults,
    searchTerm,
    isLoadingSuggested,
    isSearching,
    error,
    handleSearchChange,
    clearSearch,
    refreshSuggestedUsers,
    handleFollowUser,
  } = useSearchViewModel();

  const renderSuggestedUser = ({ item }: { item: RecommendedUser }) => (
    <TouchableOpacity 
      style={styles.userCard}
      onPress={() => navigation.navigate('UserProfile', { 
        userId: item.userId, 
        userName: `${item.firstName} ${item.lastName}` 
      })}
    >
      <View style={styles.userContent}>
        <View style={styles.userHeader}>
          <View style={styles.userInfo}>
            <View style={[styles.avatar, { backgroundColor: getCompatibilityColor(item.moodCompatibility) }]}>
              <Text style={styles.avatarText}>
                {item.firstName?.[0]?.toUpperCase() || item.lastName?.[0]?.toUpperCase() || 'U'}
              </Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.username}>
                {item.firstName} {item.lastName}
              </Text>
              <Text style={styles.handle}>@{item.userId.slice(0, 8)}</Text>
              <View style={styles.compatibilityContainer}>
                <Ionicons name="heart" size={16} color={getCompatibilityColor(item.moodCompatibility)} />
                <Text style={[styles.compatibility, { color: getCompatibilityColor(item.moodCompatibility) }]}>
                  %{item.moodCompatibility.toFixed(1)} uyumlu
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity 
            style={[
              styles.followButton, 
              item.isFollowing && styles.followingButton
            ]}
            onPress={() => handleFollowUser(item.userId)}
          >
            <Text style={[
              styles.followButtonText,
              item.isFollowing && styles.followingButtonText
            ]}>
              {item.isFollowing ? 'Takipte' : 'Takip Et'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.bio}>{item.compatibilityReason}</Text>
        
        <View style={styles.userStats}>
          <Text style={styles.compatibility}>{item.compatibilityCategory}</Text>
          <Text style={styles.dominantEmotion}>• {item.dominantEmotion}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSearchUser = ({ item }: { item: SearchUser }) => (
    <TouchableOpacity 
      style={styles.userCard}
      onPress={() => navigation.navigate('UserProfile', { 
        userId: item.id, 
        userName: `${item.firstName} ${item.lastName}` 
      })}
    >
      <View style={styles.userContent}>
        <View style={styles.userHeader}>
          <View style={styles.userInfo}>
            <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
              <Text style={styles.avatarText}>
                {item.firstName?.[0]?.toUpperCase() || item.lastName?.[0]?.toUpperCase() || 'U'}
              </Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.username}>
                {item.firstName} {item.lastName}
              </Text>
              <Text style={styles.handle}>@{item.userName}</Text>
              <Text style={styles.email}>{item.email}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={[
              styles.followButton, 
              item.isFollowing && styles.followingButton
            ]}
            onPress={() => handleFollowUser(item.id)}
          >
            <Text style={[
              styles.followButtonText,
              item.isFollowing && styles.followingButtonText
            ]}>
              {item.isFollowing ? 'Takipte' : 'Takip Et'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const getCompatibilityColor = (compatibility: number) => {
    if (compatibility >= 80) return '#10b981'; // Green
    if (compatibility >= 60) return '#f59e0b'; // Orange  
    return '#ef4444'; // Red
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    if (!searchTerm) {
      setIsSearchFocused(false);
    }
  };

  const handleClearSearch = () => {
    clearSearch();
    setIsSearchFocused(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={theme.primary} style={styles.searchIcon} />
          <TextInput
            placeholder="Kullanıcı ara..."
            value={searchTerm}
            onChangeText={handleSearchChange}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            style={styles.searchInput}
          />
          {searchTerm ? (
            <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color={theme.mutedForeground} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Show search results when searching */}
      {isSearchFocused || searchTerm ? (
        <View style={styles.content}>
          {isSearching ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.primary} />
              <Text style={styles.loadingText}>Aranıyor...</Text>
            </View>
          ) : searchResults.length > 0 ? (
            <FlatList
              data={searchResults}
              renderItem={renderSearchUser}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          ) : searchTerm ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={64} color="#d1d5db" />
              <Text style={styles.emptyText}>Kullanıcı bulunamadı</Text>
            </View>
          ) : null}
        </View>
      ) : (
        /* Show suggested users when not searching */
        <View style={styles.content}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Önerilen Kullanıcılar</Text>
            <TouchableOpacity onPress={refreshSuggestedUsers}>
              <Ionicons name="refresh" size={20} color={theme.primary} />
            </TouchableOpacity>
          </View>

          {isLoadingSuggested ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.primary} />
              <Text style={styles.loadingText}>Önerilen kullanıcılar yükleniyor...</Text>
            </View>
          ) : error ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
              <Text style={styles.emptyText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={refreshSuggestedUsers}>
                <Text style={styles.retryText}>Tekrar Dene</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={suggestedUsers}
              renderItem={renderSuggestedUser}
              keyExtractor={(item) => item.userId}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="people-outline" size={64} color="#d1d5db" />
                  <Text style={styles.emptyText}>Henüz önerilen kullanıcı yok</Text>
                </View>
              }
            />
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: theme.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.muted,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.foreground,
  },
  clearButton: {
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.card,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.foreground,
  },
  listContainer: {
    padding: 16,
  },
  userCard: {
    backgroundColor: theme.card,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userContent: {
    padding: 16,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.foreground,
    marginBottom: 2,
  },
  handle: {
    fontSize: 14,
    color: theme.mutedForeground,
    marginBottom: 4,
  },
  email: {
    fontSize: 12,
    color: theme.mutedForeground,
  },
  compatibilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compatibility: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  followButton: {
    backgroundColor: theme.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  followingButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.primary,
  },
  followButtonText: {
    color: theme.primaryForeground || 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  followingButtonText: {
    color: theme.primary,
  },
  bio: {
    fontSize: 14,
    color: theme.mutedForeground,
    lineHeight: 20,
    marginBottom: 8,
  },
  userStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dominantEmotion: {
    fontSize: 12,
    color: theme.mutedForeground,
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.mutedForeground,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.mutedForeground,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: theme.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: theme.primaryForeground || 'white',
    fontSize: 14,
    fontWeight: '500',
  },
}); 