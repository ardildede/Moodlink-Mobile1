import { useState, useEffect, useCallback } from "react";
import {
  GetUserCoreProfileUseCase,
  UserCoreProfileData,
} from "../../core/domain/usecases/userProfile/GetUserCoreProfileUseCase";
import {
  GetUserPostsUseCase,
  UserPostsData,
} from "../../core/domain/usecases/userProfile/GetUserPostsUseCase";
import { FollowUseCase } from "../../core/domain/usecases/follow/FollowUseCase";
import { LikeUseCase } from "../../core/domain/usecases/like/LikeUseCase";
import { UnlikePostUseCase } from "../../core/domain/usecases/like/UnlikePostUseCase";
import { UserProfileRepositoryImpl } from "../../core/data/repositories/UserProfileRepositoryImpl";
import { FollowRepositoryImpl } from "../../core/data/repositories/FollowRepositoryImpl";
import { LikeRepositoryImpl } from "../../core/data/repositories/LikeRepositoryImpl";
import UserApi from "../../core/data/datasources/remote/UserApi";
import FollowApi from "../../core/data/datasources/remote/FollowApi";
import LikeApi from "../../core/data/datasources/remote/LikeApi";
import { useAuthStore } from "../stores/authStore";
import { Post } from "../../core/domain/entities/Post";

// Instantiate dependencies
const userProfileRepository = new UserProfileRepositoryImpl(UserApi);
const followRepository = new FollowRepositoryImpl(FollowApi, UserApi);
const likeRepository = new LikeRepositoryImpl(LikeApi);

const getUserCoreProfileUseCase = new GetUserCoreProfileUseCase(
  userProfileRepository,
  followRepository
);
const getUserPostsUseCase = new GetUserPostsUseCase(userProfileRepository);

const followUseCase = new FollowUseCase(followRepository);
const likeUseCase = new LikeUseCase(likeRepository);
const unlikePostUseCase = new UnlikePostUseCase(likeRepository);

// Combined data structure for the view
export interface UserProfileViewData extends UserCoreProfileData {
  posts: UserPostsData;
}

interface ViewModelState {
  profileData: UserProfileViewData | null;
  isLoadingProfile: boolean;
  isLoadingPosts: boolean;
  isLoadingMore: boolean;
  isFollowLoading: boolean;
  error: string | null;
  currentPage: number;
}

export const useUserProfileViewModel = (targetUserId: string) => {
  const { user } = useAuthStore();

  const [state, setState] = useState<ViewModelState>({
    profileData: null,
    isLoadingProfile: true,
    isLoadingPosts: false,
    isLoadingMore: false,
    isFollowLoading: false,
    error: null,
    currentPage: 0,
  });

  const [postsRequested, setPostsRequested] = useState(false);

  const updateState = (updates: Partial<ViewModelState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const handleError = (error: any, defaultMessage: string): string => {
    console.error("Profile operation error:", error);
    const message = error instanceof Error ? error.message : defaultMessage;
    updateState({
      error: message,
      isLoadingProfile: false,
      isLoadingPosts: false,
      isLoadingMore: false,
    });
    return message;
  };

  const loadCoreProfile = useCallback(async () => {
    if (!user?.id || !targetUserId) return;
    updateState({ isLoadingProfile: true, error: null });
    try {
      const coreProfileData = await getUserCoreProfileUseCase.execute(
        targetUserId,
        user.id
      );
      updateState({
        profileData: {
          ...coreProfileData,
          posts: {
            items: [],
            totalCount: 0,
            hasNext: false,
            hasPrevious: false,
          },
        },
      });
    } catch (err) {
      handleError(err, "Profil yüklenemedi");
    } finally {
      updateState({ isLoadingProfile: false });
    }
  }, [user?.id, targetUserId]);

  const loadPosts = useCallback(
    async (pageIndex: number, append: boolean = false) => {
      if (!user?.id || !targetUserId) return;

      updateState({
        isLoadingPosts: !append,
        isLoadingMore: append,
        error: null,
      });

      try {
        const postsData = await getUserPostsUseCase.execute(
          targetUserId,
          pageIndex,
          10
        );

        updateState({
          profileData: state.profileData
            ? {
                ...state.profileData,
                posts: append
                  ? {
                      ...postsData,
                      items: [
                        ...state.profileData.posts.items,
                        ...postsData.items,
                      ],
                    }
                  : postsData,
              }
            : null,
          currentPage: pageIndex,
        });
      } catch (err) {
        handleError(err, "Gönderiler yüklenemedi");
      } finally {
        updateState({ isLoadingPosts: false, isLoadingMore: false });
      }
    },
    [user?.id, targetUserId, state.profileData]
  );

  // Initial load
  useEffect(() => {
    loadCoreProfile();
  }, [loadCoreProfile]);

  useEffect(() => {
    // Load posts only after core profile is loaded successfully and posts haven't been requested
    if (!state.isLoadingProfile && state.profileData && !postsRequested) {
      setPostsRequested(true);
      loadPosts(0);
    }
  }, [state.isLoadingProfile, state.profileData, postsRequested, loadPosts]);

  const loadMorePosts = () => {
    if (state.isLoadingMore || !state.profileData?.posts.hasNext) return;
    const nextPage = state.currentPage + 1;
    loadPosts(nextPage, true);
  };

  const refreshProfile = useCallback(async () => {
    setPostsRequested(false);
    await loadCoreProfile();
  }, [loadCoreProfile]);

  // Follow/Unfollow user with optimistic updates
  const handleFollowUser = useCallback(async () => {
    if (state.isFollowLoading || !user?.id || !state.profileData) return;

    const { profileData } = state;
    const isCurrentlyFollowing = profileData.isFollowing;
    const originalFollowersCount = profileData.user.followers;

    updateState({ isFollowLoading: true });

    const optimisticProfileData: UserProfileViewData = {
      ...profileData,
      isFollowing: !isCurrentlyFollowing,
      user: {
        ...profileData.user,
        followers: isCurrentlyFollowing
          ? originalFollowersCount - 1
          : originalFollowersCount + 1,
      },
    };
    updateState({ profileData: optimisticProfileData });

    try {
      if (isCurrentlyFollowing) {
        await followUseCase.unfollowUser(user.id, targetUserId);
      } else {
        const newFollowRelationship = await followUseCase.followUser(
          user.id,
          targetUserId
        );
        updateState({
          profileData: {
            ...optimisticProfileData,
            followId: newFollowRelationship.id,
          },
        });
      }
    } catch (error) {
      handleError(error, "İşlem başarısız oldu.");
      updateState({ profileData }); // Revert on error
    } finally {
      updateState({ isFollowLoading: false });
    }
  }, [user?.id, state.profileData, state.isFollowLoading, targetUserId]);

  const handleLikePost = useCallback(
    async (postId: string) => {
      if (!user?.id || !state.profileData) return;

      const originalPosts = state.profileData.posts.items;
      const postIndex = originalPosts.findIndex((p) => p.id === postId);
      if (postIndex === -1) return;

      const postToUpdate = originalPosts[postIndex];
      const isCurrentlyLiked = postToUpdate.isLiked;

      const newItems = [...originalPosts];
      newItems[postIndex] = {
        ...postToUpdate,
        isLiked: !isCurrentlyLiked,
        likesCount:
          (postToUpdate.likesCount || 0) + (isCurrentlyLiked ? -1 : 1),
      };

      updateState({
        profileData: {
          ...state.profileData,
          posts: { ...state.profileData.posts, items: newItems },
        },
      });

      try {
        if (isCurrentlyLiked) {
          await unlikePostUseCase.execute(user.id, postId);
        } else {
          const newLike = await likeUseCase.likePost(user.id, postId);
          if (newLike?.id) {
            newItems[postIndex].likeId = newLike.id;
            updateState({
              profileData: {
                ...state.profileData,
                posts: { ...state.profileData.posts, items: newItems },
              },
            });
          }
        }
      } catch (error) {
        handleError(error, "Beğenme işlemi başarısız oldu.");
        updateState({
          profileData: {
            ...state.profileData,
            posts: { ...state.profileData.posts, items: originalPosts },
          },
        }); // Revert
      }
    },
    [user?.id, state.profileData]
  );

  const isPostLiked = (postId: string): boolean => {
    return (
      state.profileData?.posts.items.find((p) => p.id === postId)?.isLiked ||
      false
    );
  };

  return {
    profileData: state.profileData,
    isLoading:
      state.isLoadingProfile ||
      (state.isLoadingPosts && state.currentPage === 0),
    isLoadingMore: state.isLoadingMore,
    isFollowLoading: state.isFollowLoading,
    error: state.error,
    loadMorePosts,
    refreshProfile,
    handleFollowUser,
    handleLikePost,
    isPostLiked,
  };
};
