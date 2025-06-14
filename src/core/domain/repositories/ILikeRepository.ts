import { Like } from "../entities/Like";

/**
 * Repository interface for Like entity operations
 */
export interface ILikeRepository {
  /**
   * Creates a new like (for post or comment)
   */
  create(like: Like): Promise<Like>;

  /**
   * Likes a specific post using dedicated endpoint
   */
  likePost(postId: string, userId: string): Promise<Like>;

  /**
   * Unlikes a specific post using dedicated endpoint
   */
  unlikePost(postId: string, userId: string): Promise<boolean>;

  /**
   * Deletes a like by ID
   */
  delete(id: string): Promise<boolean>;

  /**
   * Gets a like by ID
   */
  getById(id: string): Promise<Like>;

  /**
   * Gets a list of likes with pagination
   */
  getList(
    page: number,
    pageSize: number
  ): Promise<{
    items: Like[];
    totalCount: number;
    totalPages: number;
  }>;

  /**
   * Gets likes for a specific post
   */
  getPostLikes(
    postId: string,
    page: number,
    pageSize: number
  ): Promise<{
    items: Like[];
    totalCount: number;
    totalPages: number;
  }>;

  /**
   * Gets likes for a specific comment
   */
  getCommentLikes(
    commentId: string,
    page: number,
    pageSize: number
  ): Promise<{
    items: Like[];
    totalCount: number;
    totalPages: number;
  }>;

  /**
   * Updates a like
   */
  update(like: Like): Promise<Like>;
}
