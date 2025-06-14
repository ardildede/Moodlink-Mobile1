import { GetListResponse } from "./GetListResponse";

export interface FollowDto {
  id: string;
  followerId: string;
  followedId: string;
  createdDate: Date;
}

export interface FollowerDto {
  id: string;
  followerId: string;
  followerUserName: string;
  followerFirstName: string;
  followerLastName: string;
}

export interface FollowingDto {
  id: string;
  followedId: string;
  followedUserName: string;
  followedFirstName: string;
  followedLastName: string;
}

export interface FollowingApiDto {
  id: string;
  followedId: string;
  followedUserName: string;
  followedFirstName: string;
  followedLastName: string;
  followedEmail: string;
  followedProfilePictureFileId: string | null;
  followedDate: string;
}

export interface GetFollowingApiResponse {
  userId: string;
  totalFollowingCount: number;
  following: FollowingApiDto[];
}

export type GetFollowersResponse = GetListResponse<FollowerDto>;
export type GetFollowingResponse = GetListResponse<FollowingDto>;

export interface CreateFollowCommand {
  followerId: string;
  followedId: string;
}

export interface DeleteFollowCommand {
  followerId: string;
  followedId: string;
}

export interface CreatedFollowResponse {
  id: string;
  followerId: string;
  followedId: string;
}

export interface UpdateFollowCommand {
  id: string;
  followerId: string;
  followedId: string;
}

export interface UpdatedFollowResponse {
  id: string;
  followerId: string;
  followedId: string;
  updatedDate: string;
}

export interface DeletedFollowResponse {
  id: string;
}

export interface GetByIdFollowResponse {
  id: string;
  followerId: string;
  followedId: string;
}

export interface GetListFollowListItemDto {
  id: string;
  followerId: string;
  followedId: string;
}

export type GetListFollowResponse = GetListResponse<GetListFollowListItemDto>;
