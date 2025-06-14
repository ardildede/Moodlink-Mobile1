import { ICommentRepository } from "../../repositories/ICommentRepository";

export class UnlikeCommentUseCase {
  constructor(private commentRepository: ICommentRepository) {}

  async execute(userId: string, commentId: string): Promise<void> {
    if (!userId || !commentId) {
      throw new Error("User ID ve Comment ID gereklidir");
    }

    await this.commentRepository.unlikeComment(userId, commentId);
  }
}
