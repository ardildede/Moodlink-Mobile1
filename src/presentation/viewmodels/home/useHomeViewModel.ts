import { useState, useEffect } from "react";
import { Post } from "@/core/domain/entities/Post";
import { useAuthStore } from "@/presentation/stores/authStore";
import { GetFollowedUsersPostsUseCase } from "@/core/domain/usecases/post/GetFollowedUsersPostsUseCase";
import { PostRepositoryImpl } from "@/core/data/repositories/PostRepositoryImpl";
import PostApi from "@/core/data/datasources/remote/PostApi";

// Manuel instantiation
const postRepository = new PostRepositoryImpl(PostApi);
const getFollowedUsersPostsUseCase = new GetFollowedUsersPostsUseCase(
  postRepository
);

export function useHomeViewModel() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);

  const { user } = useAuthStore();

  const loadPosts = async (pageNumber: number = 1, append: boolean = false) => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await getFollowedUsersPostsUseCase.execute(
        user.id,
        pageNumber,
        10
      );

      if (append) {
        setPosts((prev) => [...prev, ...result.items]);
      } else {
        setPosts(result.items);
      }

      setHasMoreData(result.items.length === 10);
    } catch (err: any) {
      console.error("Failed to load posts:", err);
      setError("Gönderiler yüklenirken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshPosts = async () => {
    setPage(1);
    await loadPosts(1, false);
  };

  const loadMorePosts = async () => {
    if (!hasMoreData || isLoading) return;
    const nextPage = page + 1;
    setPage(nextPage);
    await loadPosts(nextPage, true);
  };

  useEffect(() => {
    if (user?.id) {
      loadPosts();
    }
  }, [user?.id]);

  return {
    posts,
    isLoading,
    error,
    hasMoreData,
    refreshPosts,
    loadMorePosts,
  };
}
