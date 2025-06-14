import { useState, useEffect, useCallback } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "../../navigation/types";
import { useAuthStore } from "../../stores/authStore";

// Repository imports
import { PostRepositoryImpl } from "../../../core/data/repositories/PostRepositoryImpl";
import { CommentRepositoryImpl } from "../../../core/data/repositories/CommentRepositoryImpl";
import { LikeRepositoryImpl } from "../../../core/data/repositories/LikeRepositoryImpl";
import PostApi from "../../../core/data/datasources/remote/PostApi";
import CommentApi from "../../../core/data/datasources/remote/CommentApi";
import LikeApi from "../../../core/data/datasources/remote/LikeApi";

// Use case imports
import { GetPostByIdUseCase } from "../../../core/domain/usecases/post/GetPostByIdUseCase";
import { GetCommentsUseCase } from "../../../core/domain/usecases/comment/GetCommentsUseCase";
import { CreateCommentUseCase } from "../../../core/domain/usecases/comment/CreateCommentUseCase";
import { LikeUseCase } from "../../../core/domain/usecases/like/LikeUseCase";
import { UnlikePostUseCase } from "../../../core/domain/usecases/like/UnlikePostUseCase";

// Types
import { Post } from "../../../core/domain/entities/Post";
import { Comment } from "../../../core/domain/entities/Comment";

type PostDetailsScreenParams = {
  PostDetails: { postId: string; post?: Post };
};
type PostDetailsScreenRouteProp = RouteProp<
  PostDetailsScreenParams,
  "PostDetails"
>;

// Repository instances
const postRepository = new PostRepositoryImpl(PostApi);
const commentRepository = new CommentRepositoryImpl(CommentApi);
const likeRepository = new LikeRepositoryImpl(LikeApi);

// Use case instances
const getPostByIdUseCase = new GetPostByIdUseCase(postRepository);
const getCommentsUseCase = new GetCommentsUseCase(commentRepository);
const createCommentUseCase = new CreateCommentUseCase(commentRepository);
const likeUseCase = new LikeUseCase(likeRepository);
const unlikePostUseCase = new UnlikePostUseCase(likeRepository);

export const usePostDetailsViewModel = () => {
  const route = useRoute<PostDetailsScreenRouteProp>();
  const { user } = useAuthStore();
  const { postId, post: initialPost } = route.params;

  const [post, setPost] = useState<Post | null>(initialPost || null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(!initialPost); // Eğer initial post varsa loading false
  const [error, setError] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const loadPostDetails = useCallback(
    async (forceRefresh = false) => {
      // Eğer initial post varsa ve force refresh değilse, sadece yorumları yükle
      if (initialPost && !forceRefresh) {
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const fetchedPost = await getPostByIdUseCase.execute(postId);
        setPost(fetchedPost);
      } catch (err: any) {
        setError(err.message || "Gönderi yüklenirken bir hata oluştu.");
        console.error("Failed to load post details:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [postId, initialPost]
  );

  const loadComments = useCallback(async () => {
    try {
      const fetchedComments = await getCommentsUseCase.execute({ postId });
      setComments(fetchedComments);
    } catch (err: any) {
      console.error("Failed to load comments:", err);
      // Non-critical error, maybe show a small indicator instead of a full error screen
    }
  }, [postId]);

  useEffect(() => {
    loadPostDetails();
    loadComments();
  }, [loadPostDetails, loadComments]);

  const handleCommentSubmit = useCallback(async () => {
    if (!commentText.trim() || !user?.id || !post?.id) return;
    setIsSubmittingComment(true);
    try {
      await createCommentUseCase.execute(user.id, post.id, commentText.trim());

      // Yorumları ve post detaylarını yeniden yükle (güncel sayılar için)
      await Promise.all([loadComments(), loadPostDetails(true)]);

      setCommentText("");
    } catch (err: any) {
      setError(err.message || "Yorum gönderilemedi.");
    } finally {
      setIsSubmittingComment(false);
    }
  }, [commentText, user?.id, post?.id, loadComments, loadPostDetails]);

  const handleLike = useCallback(async () => {
    if (!user?.id || !post) return;

    const originalPost = { ...post }; // Store original post state for rollback
    const isCurrentlyLiked = post.isLiked || false;

    // 1. Optimistic Update
    setPost((p) =>
      p
        ? {
            ...p,
            isLiked: !isCurrentlyLiked,
            likesCount: p.likesCount + (isCurrentlyLiked ? -1 : 1),
          }
        : null
    );

    try {
      if (isCurrentlyLiked) {
        // Unlike
        if (post.likeId) {
          await likeUseCase.unlikeEntity(post.likeId);
        } else {
          // Fallback if likeId isn't on the post object for some reason
          await unlikePostUseCase.execute(user.id, post.id);
        }
        // Clear likeId for unlike operation
        setPost((p) => (p ? { ...p, likeId: undefined } : null));
      } else {
        // Like
        const newLike = await likeUseCase.likePost(user.id, post.id);
        // Update post with the new likeId from the response
        setPost((p) => (p ? { ...p, likeId: newLike.id } : null));
      }
    } catch (err) {
      console.error("Error toggling like:", err);
      // Revert on error
      setPost(originalPost);
    }
  }, [post, user?.id]);

  return {
    post,
    comments,
    isLoading,
    error,
    commentText,
    isSubmittingComment,
    setCommentText,
    handleCommentSubmit,
    handleLike,
    loadPostDetails: () => loadPostDetails(true),
  };
};
