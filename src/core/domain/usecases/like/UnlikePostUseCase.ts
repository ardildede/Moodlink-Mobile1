import { ILikeRepository } from "../../repositories/ILikeRepository";

export class UnlikePostUseCase {
  constructor(private likeRepository: ILikeRepository) {}

  async execute(userId: string, postId: string): Promise<boolean> {
    if (!userId || !postId) {
      throw new Error("Kullanıcı ID'si ve Post ID'si gereklidir");
    }

    try {
      // Directly call the repository method that sends userId and postId
      return await this.likeRepository.unlikePost(postId, userId);
    } catch (error) {
      console.error("Error in UnlikePostUseCase:", error);
      // Re-throwing the error to be handled by the ViewModel
      throw error;
    }
  }
}
