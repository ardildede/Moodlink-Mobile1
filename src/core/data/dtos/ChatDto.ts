import { GetListResponse } from "./GetListResponse";

export interface CreateChatCommand {
  name: string;
  participantUserIds: string[];
  isGroupChat: boolean;
}

export interface CreateChatResponse {
  id: string;
  name: string;
  isGroupChat: boolean;
  createdAt: Date;
  creatorUserId: string;
}

export interface UpdateChatCommand {
  id: string;
  name: string;
}

export interface UpdatedChatResponse {
  id: string;
  name: string;
  isGroupChat: boolean;
  createdAt: Date;
}

export interface DeletedChatResponse {
  id: string;
}

export interface GetByIdChatResponse {
  id: string;
  name: string;
  isGroupChat: boolean;
  createdAt: Date;
  creatorUserId: string;
  participants: {
    id: string;
    userId: string;
    userName: string;
    joinedAt: Date;
  }[];
}

export type GetListChatResponse = GetListResponse<GetByIdChatResponse>;

export interface GetUserChatsResponse {
  chats: {
    id: string;
    name: string;
    type: string; // "Direct" or "Group"
    groupImageUrl?: string | null;
    participantCount: number;
    lastMessage?: {
      id: string;
      content: string;
      senderName: string;
      sentDate: string;
    };
    joinedDate: string;
  }[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
