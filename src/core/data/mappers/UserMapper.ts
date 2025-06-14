import { User } from "../../domain/entities/User";
import {
  UserDto,
  GetListUserListItemDto,
  GetUserFromAuthResponse,
  GetByIdUserResponse,
} from "../dtos/UserDto";

export class UserMapper {
  /**
   * Maps a UserDto to a User entity.
   */
  static toEntity(dto: UserDto | GetByIdUserResponse): User {
    return {
      id: dto.id,
      email: dto.email,
      userName: dto.userName,
      firstName: dto.firstName,
      lastName: dto.lastName,
      profileImageUrl: dto.profileImageUrl || undefined,
      createdDate: new Date(dto.createdDate),
      followers: dto.followersCount || 0,
      following: dto.followingCount || 0,
    };
  }

  /**
   * Maps a GetUserFromAuthResponse to a User entity.
   */
  static fromAuthToEntity(dto: GetUserFromAuthResponse): User {
    return {
      id: dto.id,
      email: dto.email,
      userName: dto.userName,
      firstName: dto.firstName,
      lastName: dto.lastName,
      profileImageUrl: dto.profileImageUrl || undefined,
      createdDate: new Date(), // Not provided in auth response
      followers: dto.followersCount || 0,
      following: dto.followingCount || 0,
    };
  }

  /**
   * Maps a list item DTO to a User entity.
   */
  static listItemToEntity(dto: GetListUserListItemDto): User {
    return {
      id: dto.id,
      email: dto.email,
      userName: dto.userName,
      firstName: dto.firstName,
      lastName: dto.lastName,
      profileImageUrl: dto.profileImageUrl || undefined,
      createdDate: new Date(), // Not provided in list item
      followers: dto.followersCount || 0,
      following: dto.followingCount || 0,
    };
  }

  /**
   * Maps a list of UserDtos to a list of User entities.
   */
  static toEntityList(dtos: UserDto[]): User[] {
    return dtos.map(UserMapper.toEntity);
  }
}
