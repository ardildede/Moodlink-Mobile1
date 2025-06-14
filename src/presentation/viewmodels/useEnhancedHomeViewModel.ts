import { useState, useEffect, useCallback, useRef } from "react";
import { Post } from "../../core/domain/entities/Post";
import { Activity } from "../../core/domain/entities/Activity";
import { GetFollowedUsersPostsUseCase } from "../../core/domain/usecases/post/GetFollowedUsersPostsUseCase";
import { GetPostsUseCase } from "../../core/domain/usecases/post/GetPostsUseCase";
import { GetMoodRecommendedPostsUseCase } from "../../core/domain/usecases/post/GetMoodRecommendedPostsUseCase";
import { CreatePostUseCase } from "../../core/domain/usecases/post/CreatePostUseCase";
import { LikeUseCase } from "../../core/domain/usecases/like/LikeUseCase";
import { UnlikePostUseCase } from "../../core/domain/usecases/like/UnlikePostUseCase";
import { CreateCommentUseCase } from "../../core/domain/usecases/comment/CreateCommentUseCase";
import { useAuthStore } from "../stores/authStore";
import { PostRepositoryImpl } from "../../core/data/repositories/PostRepositoryImpl";
import { LikeRepositoryImpl } from "../../core/data/repositories/LikeRepositoryImpl";
import { CommentRepositoryImpl } from "../../core/data/repositories/CommentRepositoryImpl";
import PostApi from "../../core/data/datasources/remote/PostApi";
import LikeApi from "../../core/data/datasources/remote/LikeApi";
import CommentApi from "../../core/data/datasources/remote/CommentApi";

// Repository instances
const postRepository = new PostRepositoryImpl(PostApi);
const likeRepository = new LikeRepositoryImpl(LikeApi);
const commentRepository = new CommentRepositoryImpl(CommentApi);

// Use case instances
const getFollowedUsersPostsUseCase = new GetFollowedUsersPostsUseCase(
  postRepository
);
const getPostsUseCase = new GetPostsUseCase(postRepository);
const getMoodRecommendedPostsUseCase = new GetMoodRecommendedPostsUseCase(
  postRepository
);
const createPostUseCase = new CreatePostUseCase(postRepository);
const likeUseCase = new LikeUseCase(likeRepository);
const unlikePostUseCase = new UnlikePostUseCase(likeRepository);
const createCommentUseCase = new CreateCommentUseCase(commentRepository);

type TabType = "forYou" | "following";

interface TabData {
  posts: Post[];
  activities: Activity[];
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
}

interface HomeState {
  activeTab: TabType;
  tabs: {
    forYou: TabData;
    following: TabData;
  };
  isRefreshing: boolean;
  isCreatingPost: boolean;
}

interface InteractionState {
  postLikeIds: Map<string, string>;
  bookmarkedPosts: Set<string>;
}

const createEmptyTabData = (): TabData => ({
  posts: [],
  activities: [],
  isLoaded: false,
  isLoading: false,
  error: null,
});

export function useEnhancedHomeViewModel() {
  const { user } = useAuthStore();
  const loadingRef = useRef<Map<TabType, boolean>>(new Map());

  // Main state with separate data for each tab
  const [homeState, setHomeState] = useState<HomeState>({
    activeTab: "forYou",
    tabs: {
      forYou: createEmptyTabData(),
      following: createEmptyTabData(),
    },
    isRefreshing: false,
    isCreatingPost: false,
  });

  // Interaction state
  const [interactionState, setInteractionState] = useState<InteractionState>({
    postLikeIds: new Map(),
    bookmarkedPosts: new Set(),
  });

  const handleError = (
    error: any,
    defaultMessage: string,
    tab: TabType
  ): string => {
    const message =
      error?.response?.data?.detail || error.message || defaultMessage;
    console.error(defaultMessage, error);

    setHomeState((prev) => ({
      ...prev,
      tabs: {
        ...prev.tabs,
        [tab]: {
          ...prev.tabs[tab],
          error: message,
          isLoading: false,
        },
      },
    }));
    return message;
  };

  const initializeLikedPosts = useCallback((posts: Post[]) => {
    const postLikeIds = new Map<string, string>();
    posts.forEach((post) => {
      if (post.isLiked && post.likeId) {
        postLikeIds.set(post.id, post.likeId);
      }
    });
    setInteractionState((prev) => ({ ...prev, postLikeIds }));
  }, []);

  // Load content for specific tab
  const loadTabContent = useCallback(
    async (tab: TabType, forceReload = false) => {
      if (!user?.id) return;

      // Prevent multiple simultaneous loads for the same tab
      if (loadingRef.current.get(tab) && !forceReload) return;
      loadingRef.current.set(tab, true);

      const currentTabData = homeState.tabs[tab];

      // If tab is already loaded and we're not forcing reload, skip
      if (currentTabData.isLoaded && !forceReload) {
        loadingRef.current.set(tab, false);
        return;
      }

      setHomeState((prev) => ({
        ...prev,
        tabs: {
          ...prev.tabs,
          [tab]: {
            ...prev.tabs[tab],
            isLoading: true,
            error: null,
          },
        },
      }));

      try {
        let postsData;

        if (tab === "following") {
          postsData = await getFollowedUsersPostsUseCase.execute(
            user.id,
            0,
            20
          );
        } else {
          postsData = await getMoodRecommendedPostsUseCase.execute(0, 20);
        }

        setHomeState((prev) => ({
          ...prev,
          tabs: {
            ...prev.tabs,
            [tab]: {
              ...prev.tabs[tab],
              posts: postsData.items,
              activities: [],
              isLoaded: true,
              isLoading: false,
              error: null,
            },
          },
        }));

        // Initialize interaction state only for the active tab
        if (tab === homeState.activeTab) {
          initializeLikedPosts(postsData.items);
        }
      } catch (err: any) {
        handleError(
          err,
          `${
            tab === "following" ? "Takip ettiğiniz kullanıcıların" : "Önerilen"
          } gönderileri yüklenemedi.`,
          tab
        );
      } finally {
        loadingRef.current.set(tab, false);
      }
    },
    [user?.id, homeState.activeTab, homeState.tabs, initializeLikedPosts]
  );

  // Get current tab data
  const getCurrentTabData = useCallback(() => {
    return homeState.tabs[homeState.activeTab];
  }, [homeState.activeTab, homeState.tabs]);

  // Refresh content for current tab
  const refreshContent = useCallback(async () => {
    setHomeState((prev) => ({ ...prev, isRefreshing: true }));
    try {
      await loadTabContent(homeState.activeTab, true);
    } finally {
      setHomeState((prev) => ({ ...prev, isRefreshing: false }));
    }
  }, [loadTabContent, homeState.activeTab]);

  // Switch tabs with immediate content loading
  const setActiveTab = useCallback(
    async (tab: TabType) => {
      if (tab === homeState.activeTab) return;

      // Immediately switch the active tab
      setHomeState((prev) => ({ ...prev, activeTab: tab }));

      // Load content for the new tab if not already loaded
      await loadTabContent(tab);
    },
    [homeState.activeTab, loadTabContent]
  );

  // Create new post (only affects forYou tab for now)
  const createPost = useCallback(
    async (contentText: string): Promise<boolean> => {
      if (!user?.id || !contentText.trim()) {
        return false;
      }

      setHomeState((prev) => ({ ...prev, isCreatingPost: true }));

      try {
        const newPost = await createPostUseCase.execute(
          user.id,
          contentText.trim()
        );

        // Add new post to both tabs
        setHomeState((prev) => ({
          ...prev,
          tabs: {
            forYou: {
              ...prev.tabs.forYou,
              posts: [newPost, ...prev.tabs.forYou.posts],
            },
            following: {
              ...prev.tabs.following,
              posts: [newPost, ...prev.tabs.following.posts],
            },
          },
        }));

        return true;
      } catch (err: any) {
        console.error("Create post error:", err);
        return false;
      } finally {
        setHomeState((prev) => ({ ...prev, isCreatingPost: false }));
      }
    },
    [user?.id]
  );

  // Handle like/unlike with optimistic updates
  const handleLike = useCallback(
    async (postId: string) => {
      if (!user?.id) return;

      const currentTab = homeState.activeTab;
      const currentTabData = homeState.tabs[currentTab];
      const originalPosts = currentTabData.posts;
      const postIndex = originalPosts.findIndex((p) => p.id === postId);
      if (postIndex === -1) return;

      const postToUpdate = originalPosts[postIndex];
      const isCurrentlyLiked = postToUpdate.isLiked || false;

      // Optimistic Update for current tab
      const newPosts = [...originalPosts];
      newPosts[postIndex] = {
        ...postToUpdate,
        isLiked: !isCurrentlyLiked,
        likesCount:
          (postToUpdate.likesCount || 0) + (isCurrentlyLiked ? -1 : 1),
      };

      setHomeState((prev) => ({
        ...prev,
        tabs: {
          ...prev.tabs,
          [currentTab]: {
            ...prev.tabs[currentTab],
            posts: newPosts,
          },
        },
      }));

      try {
        if (isCurrentlyLiked) {
          const likeId = postToUpdate.likeId;
          if (likeId) {
            await likeUseCase.unlikeEntity(likeId);
          } else {
            await unlikePostUseCase.execute(user.id, postId);
          }
        } else {
          const newLike = await likeUseCase.likePost(user.id, postId);
          if (newLike?.id) {
            setHomeState((prev) => ({
              ...prev,
              tabs: {
                ...prev.tabs,
                [currentTab]: {
                  ...prev.tabs[currentTab],
                  posts: prev.tabs[currentTab].posts.map((p) =>
                    p.id === postId ? { ...p, likeId: newLike.id } : p
                  ),
                },
              },
            }));
          }
        }
      } catch (err) {
        console.error("Like/unlike error:", err);
        // Revert optimistic update
        setHomeState((prev) => ({
          ...prev,
          tabs: {
            ...prev.tabs,
            [currentTab]: {
              ...prev.tabs[currentTab],
              posts: originalPosts,
            },
          },
        }));
      }
    },
    [user?.id, homeState.activeTab, homeState.tabs]
  );

  // Handle bookmark toggle
  const handleBookmark = useCallback(
    (postId: string) => {
      const newBookmarkedPosts = new Set(interactionState.bookmarkedPosts);

      if (newBookmarkedPosts.has(postId)) {
        newBookmarkedPosts.delete(postId);
      } else {
        newBookmarkedPosts.add(postId);
      }

      setInteractionState((prev) => ({
        ...prev,
        bookmarkedPosts: newBookmarkedPosts,
      }));
    },
    [interactionState]
  );

  // Handle comment count update
  const handleCommentCreated = useCallback(
    (postId: string) => {
      const currentTab = homeState.activeTab;

      setHomeState((prev) => ({
        ...prev,
        tabs: {
          ...prev.tabs,
          [currentTab]: {
            ...prev.tabs[currentTab],
            posts: prev.tabs[currentTab].posts.map((post) =>
              post.id === postId
                ? { ...post, commentsCount: (post.commentsCount || 0) + 1 }
                : post
            ),
          },
        },
      }));
    },
    [homeState.activeTab]
  );

  // Load initial content when user changes
  useEffect(() => {
    if (user?.id) {
      // Load content for the currently active tab
      loadTabContent(homeState.activeTab);

      // Preload the other tab as well for better UX
      const otherTab =
        homeState.activeTab === "forYou" ? "following" : "forYou";
      // Add a small delay to prevent overloading
      setTimeout(() => {
        loadTabContent(otherTab);
      }, 1000);
    }
  }, [user?.id]);

  const currentTabData = getCurrentTabData();

  return {
    // State
    activeTab: homeState.activeTab,
    posts: currentTabData.posts,
    activities: currentTabData.activities,
    isLoading: currentTabData.isLoading,
    isRefreshing: homeState.isRefreshing,
    isCreatingPost: homeState.isCreatingPost,
    error: currentTabData.error,

    // Interaction state
    bookmarkedPosts: interactionState.bookmarkedPosts,

    // Actions
    setActiveTab,
    refreshContent,
    createPost,
    handleLike,
    handleBookmark,
    handleCommentCreated,

    // Helpers
    isPostBookmarked: (postId: string) =>
      interactionState.bookmarkedPosts.has(postId),
    isPostLiked: (postId: string) => {
      const post = currentTabData.posts.find((p) => p.id === postId);
      return post ? post.isLiked || false : false;
    },
  };
}
