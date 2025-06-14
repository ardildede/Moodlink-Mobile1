import { IMessageRepository } from "../../domain/repositories/IMessageRepository";
import { Message } from "../../domain/entities/Message";
import { PageRequest } from "../dtos/PageRequest";
import MessageApi from "../datasources/remote/MessageApi";
import { MessageMapper } from "../mappers/MessageMapper";

export class MessageRepositoryImpl implements IMessageRepository {
  constructor(private messageApi: typeof MessageApi) {}

  async sendMessage(
    chatId: string,
    content: string,
    messageType: number = 0
  ): Promise<Message> {
    const response = await this.messageApi.sendMessage({
      chatId,
      content,
    });

    return MessageMapper.sendResponseToEntity(response);
  }

  async sendDirectMessage(
    recipientUserId: string,
    content: string
  ): Promise<Message> {
    const response = await this.messageApi.sendDirectMessage({
      receiverUserId: recipientUserId,
      content,
    });

    return MessageMapper.sendDirectResponseToEntity(response);
  }

  async getChatMessages(
    chatId: string,
    pageRequest: PageRequest
  ): Promise<{
    items: Message[];
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  }> {
    const response = await this.messageApi.getChatMessages(chatId, pageRequest);

    // Guard against undefined or null messages array (API uses 'messages' field, not 'items')
    const messages = response.messages || [];

    return {
      items: MessageMapper.chatMessagesToEntityList(messages),
      pageIndex: response.pageIndex,
      pageSize: response.pageSize,
      totalCount: response.totalCount,
      hasPreviousPage: response.hasPrevious,
      hasNextPage: response.hasNext,
    };
  }

  async getById(id: string): Promise<Message | null> {
    try {
      const response = await this.messageApi.getMessageById(id);
      return MessageMapper.toEntity(response);
    } catch (error) {
      console.error("Get message by ID failed:", error);
      return null;
    }
  }

  async update(message: Pick<Message, "id" | "content">): Promise<Message> {
    const command = MessageMapper.toUpdateCommand(message);
    const response = await this.messageApi.updateMessage(command);
    return MessageMapper.toEntity(response);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.messageApi.deleteMessage(id);
      return true;
    } catch (error) {
      console.error("Delete message failed:", error);
      return false;
    }
  }

  async markAsRead(chatId: string): Promise<boolean> {
    // MessageApi doesn't have markAsRead method, this is a placeholder
    try {
      // This would need to be implemented in MessageApi when the endpoint is available
      console.warn("markAsRead method not implemented in MessageApi");
      return true;
    } catch (error) {
      console.error("Mark messages as read failed:", error);
      return false;
    }
  }
}
