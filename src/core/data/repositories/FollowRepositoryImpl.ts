import { IFollowRepository } from "../../domain/repositories/IFollowRepository";
import { Follow } from "../../domain/entities/Follow";
import FollowApi from "../datasources/remote/FollowApi";
import UserApi from "../datasources/remote/UserApi";
import { FollowMapper } from "../mappers/FollowMapper";
import { PageRequest } from "../dtos/PageRequest";
import { GetListResponse } from "../dtos/GetListResponse";
import { FollowingUser } from "../../domain/entities/User";
import { useAuthStore } from "@/presentation/stores/authStore";

export class FollowRepositoryImpl implements IFollowRepository {
  constructor(
    private followApi: typeof FollowApi,
    private userApi: typeof UserApi
  ) {}

  // isFollowing için API endpoint'i yok, bu yüzden bunu varsayımsal olarak ekliyorum.
  // Gerçek bir endpoint'e bağlanması gerekir.
  private isFollowingMap = new Map<string, boolean>();

  async getFollowing(
    userId: string,
    pageRequest: PageRequest
  ): Promise<GetListResponse<FollowingUser>> {
    const response = await this.followApi.getFollowing(userId, pageRequest);
    const followingUsers =
      FollowMapper.fromApiResponseToFollowingUsers(response);

    // GetListResponse formatına dönüştür
    return {
      items: followingUsers,
      pageIndex: pageRequest.pageIndex,
      pageSize: pageRequest.pageSize,
      totalCount: response.totalFollowingCount,
      hasPreviousPage: pageRequest.pageIndex > 0,
      hasNextPage:
        (pageRequest.pageIndex + 1) * pageRequest.pageSize <
        response.totalFollowingCount,
    };
  }

  async follow(userId: string): Promise<void> {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) {
      throw new Error("User must be authenticated to follow others");
    }

    await this.followApi.followUser({
      followerId: currentUser.id,
      followedId: userId,
    });
    this.isFollowingMap.set(userId, true);
  }

  async unfollow(userId: string): Promise<void> {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) {
      throw new Error("User must be authenticated to unfollow others");
    }

    await this.followApi.unfollowUser({
      followerId: currentUser.id,
      followedId: userId,
    });
    this.isFollowingMap.set(userId, false);
  }

  async isFollowing(
    followerId: string,
    followedUserId: string
  ): Promise<boolean> {
    // Bu normalde bir API çağrısı olmalı, şimdilik geçici bir çözüm.
    // Örneğin: const response = await FollowApi.checkIsFollowing(followerId, followedUserId);
    return this.isFollowingMap.get(followedUserId) || false;
  }

  // Eski metodlar - uyumluluk için kaldım
  async followUser(
    followerId: string,
    followedUserId: string
  ): Promise<Follow> {
    await this.follow(followedUserId);
    return {
      id: "", // API'den gelecek
      followerId,
      followedId: followedUserId,
      followedAt: new Date(),
    };
  }

  async unfollowUser(
    followerId: string,
    followedUserId: string
  ): Promise<boolean> {
    await this.unfollow(followedUserId);
    return true;
  }

  async getFollowDetails(
    userId: string,
    followedUserId: string
  ): Promise<{ isFollowing: boolean; followId?: string }> {
    const isFollowing = await this.isFollowing(userId, followedUserId);
    return { isFollowing };
  }

  async unfollowById(followId: string): Promise<boolean> {
    // Bu implementasyon eksik
    return false;
  }
}
