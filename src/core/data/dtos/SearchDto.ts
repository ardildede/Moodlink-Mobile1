import { GetListResponse } from "./GetListResponse";
import { GetListPostListItemDto } from "./PostDto";
import { GetListUserListItemDto } from "./UserDto";

export interface SearchResultUser {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
}

export interface SearchResultPost {
  id: string;
  userId: string;
  content: string;
  postDate: string;
  userName: string;
}

export interface SearchUsersAndPostsResponse {
  users: GetListResponse<SearchResultUser>;
  posts: GetListResponse<SearchResultPost>;
}
