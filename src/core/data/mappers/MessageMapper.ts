import { Message } from "../../domain/entities/Message";
import {
  CreateMessageCommand,
  CreatedMessageResponse,
  SendMessageCommand,
  SendMessageResponse,
  SendDirectMessageCommand,
  SendDirectMessageResponse,
  UpdateMessageCommand,
  UpdatedMessageResponse,
  GetByIdMessageResponse,
  GetChatMessagesResponse,
  ChatMessageDto,
} from "../dtos/MessageDto";

export class MessageMapper {
  /**
   * Maps a CreatedMessageResponse to a Message entity.
   */
  static toEntity(
    dto:
      | CreatedMessageResponse
      | GetByIdMessageResponse
      | UpdatedMessageResponse
  ): Message {
    return {
      id: dto.id,
      chatId: dto.chatId,
      senderId: dto.senderUserId,
      content: dto.content || "",
      sentAt: new Date(dto.sentDate),
      isRead: false, // Default to unread
    };
  }

  /**
   * Maps a ChatMessageDto to a Message entity.
   */
  static chatMessageToEntity(dto: ChatMessageDto): Message {
    return {
      id: dto.id,
      chatId: dto.chatId,
      senderId: dto.senderUserId,
      content: dto.content || "",
      sentAt: new Date(dto.sentDate),
      isRead: false, // Default to unread
      sender: dto.senderUserName
        ? {
            id: dto.senderUserId,
            firstName: dto.senderFirstName || "",
            lastName: dto.senderLastName || "",
            userName: dto.senderUserName,
            email: "", // Not provided in DTO
            profileImageUrl: undefined,
            createdDate: new Date(),
            followers: 0,
            following: 0,
          }
        : undefined,
    };
  }

  /**
   * Maps a Message entity to a CreateMessageCommand.
   */
  static toCreateCommand(
    entity: Omit<Message, "id" | "isRead">
  ): CreateMessageCommand {
    return {
      chatId: entity.chatId,
      senderUserId: entity.senderId,
      content: entity.content,
      sentDate: entity.sentAt.toISOString(),
    };
  }

  /**
   * Maps a Message entity to a SendMessageCommand.
   */
  static toSendCommand(
    entity: Pick<Message, "chatId" | "content">
  ): SendMessageCommand {
    return {
      chatId: entity.chatId,
      content: entity.content,
    };
  }

  /**
   * Maps a Message entity to a SendDirectMessageCommand.
   */
  static toSendDirectCommand(
    entity: Pick<Message, "content">,
    receiverUserId: string
  ): SendDirectMessageCommand {
    return {
      receiverUserId,
      content: entity.content,
    };
  }

  /**
   * Maps a Message entity to an UpdateMessageCommand.
   */
  static toUpdateCommand(
    entity: Pick<Message, "id" | "content">
  ): UpdateMessageCommand {
    return {
      id: entity.id,
      content: entity.content,
    };
  }

  /**
   * Maps a list of Message DTOs to a list of Message entities.
   */
  static toEntityList(dtos: GetByIdMessageResponse[]): Message[] {
    return dtos.map(MessageMapper.toEntity);
  }

  /**
   * Maps a list of ChatMessage DTOs to a list of Message entities.
   */
  static chatMessagesToEntityList(dtos: ChatMessageDto[]): Message[] {
    // Guard against undefined or null array
    if (!dtos || !Array.isArray(dtos)) {
      console.warn(
        "MessageMapper.chatMessagesToEntityList received invalid data:",
        dtos
      );
      return [];
    }
    return dtos.map(MessageMapper.chatMessageToEntity);
  }

  /**
   * Maps SendMessageResponse to a Message entity.
   */
  static sendResponseToEntity(dto: SendMessageResponse): Message {
    // Create a valid Date object, fallback to current time if createdDate is invalid
    let sentDate: Date;
    try {
      sentDate = dto.sentDate ? new Date(dto.sentDate) : new Date();
      if (isNaN(sentDate.getTime())) {
        sentDate = new Date();
      }
    } catch {
      sentDate = new Date();
    }

    return {
      id: dto.id,
      chatId: dto.chatId,
      senderId: dto.senderUserId,
      content: dto.content,
      sentAt: sentDate,
      isRead: false,
    };
  }

  /**
   * Maps SendDirectMessageResponse to a Message entity.
   */
  static sendDirectResponseToEntity(dto: SendDirectMessageResponse): Message {
    // Create a valid Date object, fallback to current time if createdDate is invalid
    let sentDate: Date;
    try {
      sentDate = dto.sentDate ? new Date(dto.sentDate) : new Date();
      if (isNaN(sentDate.getTime())) {
        sentDate = new Date();
      }
    } catch {
      sentDate = new Date();
    }

    return {
      id: dto.id,
      chatId: dto.chatId,
      senderId: dto.senderUserId,
      content: dto.content,
      sentAt: sentDate,
      isRead: false,
    };
  }

  /**
   * Maps GetChatMessagesResponse to a more usable format
   */
  static toChatMessagesEntity(dto: GetChatMessagesResponse) {
    const messages = dto.messages || [];
    return {
      messages: MessageMapper.chatMessagesToEntityList(messages),
      pagination: {
        pageIndex: dto.pageIndex,
        pageSize: dto.pageSize,
        totalCount: dto.totalCount,
        hasPreviousPage: dto.hasPrevious,
        hasNextPage: dto.hasNext,
      },
    };
  }
}
