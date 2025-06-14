import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useAuthStore } from "../stores/authStore";
import { GetFollowingUseCase } from "../../core/domain/usecases/follow/GetFollowingUseCase";
import { FollowRepositoryImpl } from "../../core/data/repositories/FollowRepositoryImpl";
import FollowApi from "../../core/data/datasources/remote/FollowApi";
import UserApi from "../../core/data/datasources/remote/UserApi";
import { FollowingUser } from "../../core/domain/entities/User";

export const useNewConversationViewModel = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [users, setUsers] = useState<FollowingUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<FollowingUser[]>([]);
  const [searchTerm, setSearchTermValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isLoadingRef = useRef(false);
  const hasLoadedInitially = useRef(false);

  // Memoize repository and use case to prevent recreation on every render
  const followRepository = useMemo(
    () => new FollowRepositoryImpl(FollowApi, UserApi),
    []
  );
  const getFollowingUseCase = useMemo(
    () => new GetFollowingUseCase(followRepository),
    [followRepository]
  );

  const setSearchTerm = useCallback(
    (term: string) => {
      setSearchTermValue(term);
      if (term.trim() === "") {
        setFilteredUsers(users);
      } else {
        const filtered = users.filter(
          (u) =>
            u.firstName.toLowerCase().includes(term.toLowerCase()) ||
            u.lastName.toLowerCase().includes(term.toLowerCase()) ||
            u.userName.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredUsers(filtered);
      }
    },
    [users]
  );

  const loadUsers = useCallback(async () => {
    if (!user?.id || isLoadingRef.current) return;

    isLoadingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const response = await getFollowingUseCase.execute(user.id, 0, 50);
      const followingUsers = response?.items || [];
      setUsers(followingUsers);
      setFilteredUsers(followingUsers);
      hasLoadedInitially.current = true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load following users"
      );
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, [user?.id, getFollowingUseCase]);

  const refresh = useCallback(async () => {
    if (!isLoadingRef.current) {
      hasLoadedInitially.current = false; // Reset to allow reload
      await loadUsers();
    }
  }, [loadUsers]);

  useEffect(() => {
    if (user?.id && !hasLoadedInitially.current && !isLoadingRef.current) {
      loadUsers();
    }
  }, [user?.id, loadUsers]);

  return {
    users: users || [],
    filteredUsers: filteredUsers || [],
    searchTerm,
    setSearchTerm,
    isLoading,
    error,
    refresh,
  };
};
