import { Post } from "../../entities/Post";
import { IPostRepository } from "../../repositories/IPostRepository";

export class GetPostByIdUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute(postId: string): Promise<Post> {
    return await this.postRepository.getById(postId);
  }
}
