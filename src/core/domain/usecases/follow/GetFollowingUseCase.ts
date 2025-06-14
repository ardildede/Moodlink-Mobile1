import { FollowingUser } from "../../entities/User";
import { IFollowRepository } from "../../repositories/IFollowRepository";
import { GetListResponse } from "../../../data/dtos/GetListResponse";
import { PageRequest } from "../../../data/dtos/PageRequest";

export class GetFollowingUseCase {
  constructor(private readonly followRepository: IFollowRepository) {}

  async execute(
    userId: string,
    page: number,
    pageSize: number
  ): Promise<GetListResponse<FollowingUser>> {
    if (!userId) {
      throw new Error("Kullanıcı ID'si gereklidir.");
    }
    const pageRequest: PageRequest = { pageIndex: page, pageSize };
    return this.followRepository.getFollowing(userId, pageRequest);
  }
}
