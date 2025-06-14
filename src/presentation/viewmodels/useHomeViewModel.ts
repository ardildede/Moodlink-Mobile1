import { useState, useEffect } from "react";
import { Post } from "@/core/domain/entities/Post";
import { Activity } from "@/core/domain/entities/Activity";
import { GetFollowedUsersPostsUseCase } from "@/core/domain/usecases/post/GetFollowedUsersPostsUseCase";
import { useAuthStore } from "@/presentation/stores/authStore";
import { PostRepositoryImpl } from "@/core/data/repositories/PostRepositoryImpl";
import PostApi from "@/core/data/datasources/remote/PostApi";

// Manuel instantiation
const postRepository = new PostRepositoryImpl(PostApi);
const getFollowedUsersPostsUseCase = new GetFollowedUsersPostsUseCase(
  postRepository
);

export function useHomeViewModel() {
  const [activeTab, setActiveTab] = useState<"forYou" | "following">("forYou");
  const [posts, setPosts] = useState<Post[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuthStore();

  const loadFollowingPosts = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const followedPosts = await getFollowedUsersPostsUseCase.execute(
        user.id,
        1, // page
        20 // pageSize
      );
      setPosts(followedPosts.items);
    } catch (err: any) {
      console.error("Failed to load following posts:", err);
      setError("Takip ettiğiniz kullanıcıların gönderileri yüklenemedi.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadForYouContent = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // For now, we'll just show empty activities
      // In the future, this could load recommended activities
      setActivities([]);
    } catch (err: any) {
      console.error("Failed to load for you content:", err);
      setError("İçerik yüklenemedi.");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshContent = async () => {
    if (activeTab === "following") {
      await loadFollowingPosts();
    } else {
      await loadForYouContent();
    }
  };

  useEffect(() => {
    refreshContent();
  }, [activeTab, user?.id]);

  return {
    activeTab,
    setActiveTab,
    posts,
    activities,
    isLoading,
    error,
    refreshContent,
  };
}
