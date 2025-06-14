import { Follow } from "../entities/Follow";
import { FollowingUser } from "../entities/User";
import { PageRequest } from "../../data/dtos/PageRequest";
import { GetListResponse } from "../../data/dtos/GetListResponse";

export interface IFollowRepository {
  getFollowing(
    userId: string,
    pageRequest: PageRequest
  ): Promise<GetListResponse<FollowingUser>>;
  follow(userId: string): Promise<void>;
  unfollow(userId: string): Promise<void>;
  isFollowing(followerId: string, followedUserId: string): Promise<boolean>;

  // Use case'lerin kullandığı metodlar
  followUser(followerId: string, followedUserId: string): Promise<Follow>;
  unfollowUser(followerId: string, followedUserId: string): Promise<boolean>;

  // Ek metodlar
  getFollowDetails(
    userId: string,
    followedUserId: string
  ): Promise<{ isFollowing: boolean; followId?: string }>;
  unfollowById(followId: string): Promise<boolean>;
}
