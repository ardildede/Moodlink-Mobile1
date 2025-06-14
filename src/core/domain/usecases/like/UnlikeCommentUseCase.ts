import { ILikeRepository } from "../../repositories/ILikeRepository";

export class UnlikeCommentUseCase {
  constructor(private likeRepository: ILikeRepository) {}

  async execute(userId: string, commentId: string): Promise<boolean> {
    if (!userId || !commentId) {
      throw new Error("Kullanıcı ID'si ve Yorum ID'si gereklidir");
    }

    try {
      // For comments, we would need a different repository method
      // For now, using the same pattern as posts
      return await this.likeRepository.unlikePost(commentId, userId);
    } catch (error) {
      console.error("Error in UnlikeCommentUseCase:", error);
      throw error;
    }
  }
}
