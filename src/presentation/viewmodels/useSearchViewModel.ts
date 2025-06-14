import { useState, useEffect, useCallback } from "react";
import { RecommendedUser } from "../../core/domain/entities/RecommendedUser";
import { SearchUser } from "../../core/domain/entities/SearchResult";
import { GetSuggestedUsersUseCase } from "../../core/domain/usecases/search/GetSuggestedUsersUseCase";
import { SearchUsersUseCase } from "../../core/domain/usecases/search/SearchUsersUseCase";
import { FollowUseCase } from "../../core/domain/usecases/follow/FollowUseCase";
import { SearchRepositoryImpl } from "../../core/data/repositories/SearchRepositoryImpl";
import { FollowRepositoryImpl } from "../../core/data/repositories/FollowRepositoryImpl";
import SearchApi from "../../core/data/datasources/remote/SearchApi";
import FollowApi from "../../core/data/datasources/remote/FollowApi";
import UserApi from "../../core/data/datasources/remote/UserApi";
import { useAuthStore } from "../stores/authStore";

// Instantiate dependencies
const searchRepository = new SearchRepositoryImpl(SearchApi);
const followRepository = new FollowRepositoryImpl(FollowApi, UserApi);
const getSuggestedUsersUseCase = new GetSuggestedUsersUseCase(
  searchRepository,
  followRepository
);
const searchUsersUseCase = new SearchUsersUseCase(
  searchRepository,
  followRepository
);
const followUseCase = new FollowUseCase(followRepository);

type UserEntityType = RecommendedUser | SearchUser;

interface SearchState {
  suggestedUsers: RecommendedUser[];
  searchResults: SearchUser[];
  searchTerm: string;
  isLoadingSuggested: boolean;
  isSearching: boolean;
  error: string | null;
}

export const useSearchViewModel = () => {
  const { user } = useAuthStore();
  const [state, setState] = useState<SearchState>({
    suggestedUsers: [],
    searchResults: [],
    searchTerm: "",
    isLoadingSuggested: false,
    isSearching: false,
    error: null,
  });

  const updateState = (updates: Partial<SearchState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const handleError = (error: any, defaultMessage: string) => {
    console.error("Search operation error:", error);
    const message = error instanceof Error ? error.message : defaultMessage;
    updateState({ error: message });
  };

  const loadSuggestedUsers = useCallback(async () => {
    if (!user?.id) return;

    updateState({ isLoadingSuggested: true, error: null });
    try {
      const users = await getSuggestedUsersUseCase.execute(user.id, 0, 10);
      updateState({ suggestedUsers: users });
    } catch (err) {
      handleError(err, "Önerilen kullanıcılar yüklenirken hata oluştu");
    } finally {
      updateState({ isLoadingSuggested: false });
    }
  }, [user?.id]);

  const searchUsers = useCallback(
    async (term: string) => {
      if (!term.trim() || !user?.id) {
        updateState({ searchResults: [] });
        return;
      }

      updateState({ isSearching: true, error: null });
      try {
        const users = await searchUsersUseCase.execute(term, user.id);
        updateState({ searchResults: users });
      } catch (err) {
        handleError(err, "Arama sırasında hata oluştu");
      } finally {
        updateState({ isSearching: false });
      }
    },
    [user?.id]
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      searchUsers(state.searchTerm);
    }, 300);

    return () => clearTimeout(handler);
  }, [state.searchTerm, searchUsers]);

  const handleSearchChange = (term: string) => {
    updateState({ searchTerm: term });
  };

  const clearSearch = () => {
    updateState({ searchTerm: "", searchResults: [], error: null });
  };

  const updateUserFollowState = (
    userId: string,
    isFollowing: boolean,
    followId?: string
  ) => {
    const updateUser = (userList: UserEntityType[]): UserEntityType[] => {
      return userList.map((u) => {
        const id = "userId" in u ? u.userId : u.id;
        if (id === userId) {
          return { ...u, isFollowing, followId };
        }
        return u;
      });
    };

    updateState({
      suggestedUsers: updateUser(state.suggestedUsers) as RecommendedUser[],
      searchResults: updateUser(state.searchResults) as SearchUser[],
    });
  };

  const handleFollowUser = useCallback(
    async (targetUserId: string) => {
      if (!user?.id) {
        handleError(new Error("Kullanıcı girişi gerekli"), "İşlem başarısız");
        return;
      }

      const allUsers = [...state.suggestedUsers, ...state.searchResults];
      const targetUser = allUsers.find(
        (u) => ("userId" in u ? u.userId : u.id) === targetUserId
      );
      if (!targetUser) return;

      const isCurrentlyFollowing = targetUser.isFollowing;

      // Optimistic update
      updateUserFollowState(
        targetUserId,
        !isCurrentlyFollowing,
        targetUser.followId
      );

      try {
        if (isCurrentlyFollowing) {
          await followUseCase.unfollowUser(user.id, targetUserId);
        } else {
          const newFollow = await followUseCase.followUser(
            user.id,
            targetUserId
          );
          // Update with new followId from server
          updateUserFollowState(targetUserId, true, newFollow.id);
        }
      } catch (error) {
        // Revert optimistic update
        updateUserFollowState(
          targetUserId,
          isCurrentlyFollowing,
          targetUser.followId
        );
        handleError(error, "Takip işlemi başarısız oldu");
      }
    },
    [user?.id, state.suggestedUsers, state.searchResults]
  );

  useEffect(() => {
    loadSuggestedUsers();
  }, [loadSuggestedUsers]);

  return {
    ...state,
    handleSearchChange,
    clearSearch,
    handleFollowUser,
    refreshSuggestedUsers: loadSuggestedUsers,
  };
};
