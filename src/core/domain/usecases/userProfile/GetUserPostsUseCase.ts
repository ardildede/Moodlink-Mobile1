import { IUserProfileRepository } from "../../repositories/IUserProfileRepository";
import { Post } from "../../entities/Post";

export interface UserPostsData {
  items: Post[];
  totalCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export class GetUserPostsUseCase {
  constructor(private userProfileRepository: IUserProfileRepository) {}

  async execute(
    targetUserId: string,
    pageIndex: number = 0,
    pageSize: number = 10
  ): Promise<UserPostsData> {
    try {
      const posts = await this.userProfileRepository.getUserPosts(
        targetUserId,
        pageIndex,
        pageSize
      );
      return posts;
    } catch (error) {
      console.error("Get user posts failed:", error);
      throw new Error("Kullanıcı gönderileri yüklenemedi.");
    }
  }
}
