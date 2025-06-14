import { useState, useEffect, useCallback } from "react";
import { Post } from "../../core/domain/entities/Post";
import { GetFollowedUsersPostsUseCase } from "../../core/domain/usecases/post/GetFollowedUsersPostsUseCase";
import { CreatePostUseCase } from "../../core/domain/usecases/post/CreatePostUseCase";
import { useAuthStore } from "../stores/authStore";
import { PostRepositoryImpl } from "../../core/data/repositories/PostRepositoryImpl";
import PostApi from "../../core/data/datasources/remote/PostApi";
// import { GetForYouPostsUseCase } from "@/core/domain/usecases/post/GetForYouPostsUseCase";
// Diğer use case importları da buraya eklenebilir.

// Manuel instantiation
const postRepository = new PostRepositoryImpl(PostApi);
const getFollowedUsersPostsUseCase = new GetFollowedUsersPostsUseCase(
  postRepository
);
const createPostUseCase = new CreatePostUseCase(postRepository);
// const getForYouPostsUseCase = new GetForYouPostsUseCase(postRepository);
// const likeUseCase = container.resolve(LikeUseCase);
// const createCommentUseCase = container.resolve(CreateCommentUseCase);

export const useHomeViewModel = () => {
  const [activeTab, setActiveTab] = useState<"forYou" | "following">("forYou");
  // Şimdilik sadece 'following' sekmesine odaklanıyoruz (postlar)
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  const { user } = useAuthStore();

  const fetchData = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      setIsRefreshing(false);
      setPosts([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      let response;
      if (activeTab === "following") {
        response = await getFollowedUsersPostsUseCase.execute(user.id, 1, 20);
      } else {
        // Placeholder for "For You" feed logic
        // In a real app, you would use a different use case here.
        response = await getFollowedUsersPostsUseCase.execute(user.id, 1, 20);
        // response = await getForYouPostsUseCase.execute(user.id, 1, 20);
      }

      setPosts(response.items);
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [activeTab, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchData();
  }, [fetchData]);

  const createPost = useCallback(
    async (contentText: string) => {
      if (!user) {
        setError("Gönderi paylaşmak için giriş yapmalısınız");
        return;
      }

      if (!contentText.trim()) {
        setError("Gönderi içeriği boş olamaz");
        return;
      }

      try {
        setIsCreatingPost(true);
        setError(null);

        const newPost = await createPostUseCase.execute(user.id, contentText);

        // Add the new post to the beginning of the posts array
        setPosts((prevPosts) => [newPost, ...prevPosts]);

        return true;
      } catch (e: any) {
        setError(e.message || "Gönderi paylaşılırken bir hata oluştu");
        return false;
      } finally {
        setIsCreatingPost(false);
      }
    },
    [user]
  );

  return {
    activeTab,
    posts,
    isLoading,
    isRefreshing,
    isCreatingPost,
    error,
    setActiveTab,
    handleRefresh,
    createPost,
    // Like ve comment handler'ları şimdilik basitlik adına kaldırıldı
    // Kendi use case'leri ile yeniden eklenebilirler
  };
};
