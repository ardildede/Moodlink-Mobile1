import { Comment } from "../../entities/Comment";
import { ICommentRepository } from "../../repositories/ICommentRepository";

export class GetPostCommentsUseCase {
  constructor(private commentRepository: ICommentRepository) {}

  async execute(
    postId: string,
    page: number,
    pageSize: number
  ): Promise<{
    items: Comment[];
    totalCount: number;
    totalPages: number;
  }> {
    return await this.commentRepository.getPostComments(postId, page, pageSize);
  }
}
