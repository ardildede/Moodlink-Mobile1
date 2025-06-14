import { GetListResponse } from "./GetListResponse";

export interface CreateLikeCommand {
  userId: string;
  postId?: string | null;
  commentId?: string | null;
}

export interface CreatedLikeResponse {
  id: string;
  userId: string;
  postId?: string | null;
  commentId?: string | null;
}

export interface UpdateLikeCommand {
  id: string;
  userId: string;
  postId?: string | null;
  commentId?: string | null;
}

export interface UpdatedLikeResponse {
  id: string;
  userId: string;
  postId?: string | null;
  commentId?: string | null;
  updatedDate: string;
}

export interface DeletedLikeResponse {
  id: string;
}

// New response type for the new unlike endpoint
export interface DeletedLikeByUserAndPostResponse {
  id: string;
  userId: string;
  postId: string;
  deletedAt: string;
}

export interface GetByIdLikeResponse {
  id: string;
  userId: string;
  postId?: string | null;
  commentId?: string | null;
}

export interface GetListLikeListItemDto {
  id: string;
  userId: string;
  postId?: string | null;
  commentId?: string | null;
}

export type GetListLikeResponse = GetListResponse<GetListLikeListItemDto>;
