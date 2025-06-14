import { Follow } from "../../domain/entities/Follow";
import {
  CreateFollowCommand,
  CreatedFollowResponse,
  GetFollowingApiResponse,
  FollowingApiDto,
} from "../dtos/FollowDto";
import { FollowingUser } from "../../domain/entities/User";

export class FollowMapper {
  static fromApi(apiFollow: any): Follow {
    return {
      id: apiFollow.id,
      followerId: apiFollow.followerId,
      followedId: apiFollow.followedId,
      followedAt: new Date(apiFollow.followedDate || apiFollow.createdDate),
    };
  }

  static toApi(follow: Partial<Follow>): any {
    return {
      id: follow.id,
      followerId: follow.followerId,
      followedId: follow.followedId,
      followedDate: follow.followedAt?.toISOString(),
    };
  }

  static toCreateCommand(
    followerId: string,
    followedId: string
  ): CreateFollowCommand {
    return {
      followerId: followerId,
      followedId: followedId,
    };
  }

  static fromCreatedResponse(response: CreatedFollowResponse): Partial<Follow> {
    return {
      id: response.id,
      followerId: response.followerId,
      followedId: response.followedId,
    };
  }

  static fromApiResponseToFollowingUsers(
    response: GetFollowingApiResponse
  ): FollowingUser[] {
    return response.following.map(this.fromApiDtoToFollowingUser);
  }

  static fromApiDtoToFollowingUser(dto: FollowingApiDto): FollowingUser {
    return {
      id: dto.followedId,
      userName: dto.followedUserName,
      firstName: dto.followedFirstName,
      lastName: dto.followedLastName,
    };
  }
}
