import { Post } from "../../entities/Post";
import { IPostRepository } from "../../repositories/IPostRepository";

export class GetMoodRecommendedPostsUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute(
    page: number,
    pageSize: number
  ): Promise<{
    items: Post[];
    totalCount: number;
    totalPages: number;
  }> {
    return await this.postRepository.getMoodRecommendedPosts(page, pageSize);
  }
}
