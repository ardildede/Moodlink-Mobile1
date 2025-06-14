import { Chat } from "../entities/Chat";
import { PageRequest } from "../../data/dtos/PageRequest";

export interface UserChatItem {
  id: string;
  name: string;
  chatType: number;
  lastMessage?: {
    content: string;
    senderId: string;
    senderName: string;
    sentAt: Date;
  };
  unreadCount: number;
  participantProfilePictures: (string | undefined)[];
}

/**
 * Repository interface for Chat entity operations
 */
export interface IChatRepository {
  /**
   * Creates a new chat
   */
  create(chat: Omit<Chat, "id" | "createdAt">): Promise<Chat>;

  /**
   * Updates an existing chat
   */
  update(chat: Pick<Chat, "id" | "name">): Promise<Chat>;

  /**
   * Deletes a chat by ID
   */
  delete(id: string): Promise<boolean>;

  /**
   * Gets a chat by ID
   */
  getById(id: string): Promise<Chat | null>;

  /**
   * Gets a list of chats with pagination
   */
  getList(pageRequest: PageRequest): Promise<{
    items: Chat[];
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  }>;

  /**
   * Gets user's chats
   */
  getUserChats(pageRequest: PageRequest): Promise<UserChatItem[]>;
}
