import { Message } from "../entities/Message";
import { PageRequest } from "../../data/dtos/PageRequest";

/**
 * Repository interface for Message entity operations
 */
export interface IMessageRepository {
  /**
   * Sends a message to a chat
   */
  sendMessage(
    chatId: string,
    content: string,
    messageType?: number
  ): Promise<Message>;

  /**
   * Sends a direct message to a user
   */
  sendDirectMessage(recipientUserId: string, content: string): Promise<Message>;

  /**
   * Gets messages for a chat with pagination
   */
  getChatMessages(
    chatId: string,
    pageRequest: PageRequest
  ): Promise<{
    items: Message[];
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  }>;

  /**
   * Gets a message by ID
   */
  getById(id: string): Promise<Message | null>;

  /**
   * Updates a message
   */
  update(message: Pick<Message, "id" | "content">): Promise<Message>;

  /**
   * Deletes a message
   */
  delete(id: string): Promise<boolean>;

  /**
   * Marks messages as read in a chat
   */
  markAsRead(chatId: string): Promise<boolean>;
}
