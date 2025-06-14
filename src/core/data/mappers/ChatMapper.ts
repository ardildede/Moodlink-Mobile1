import {
  CreateChatCommand,
  CreateChatResponse,
  UpdateChatCommand,
  UpdatedChatResponse,
  GetByIdChatResponse,
  GetUserChatsResponse,
} from "../dtos/ChatDto";
import { Chat, UserChatItem, ChatType } from "../../domain/entities/Chat";
import { useAuthStore } from "@/presentation/stores/authStore";

export class ChatMapper {
  /**
   * Maps a CreateChatResponse to a Chat entity.
   */
  static toEntity(dto: GetByIdChatResponse): Chat {
    return {
      id: dto.id,
      name: dto.name,
      isGroupChat: dto.isGroupChat,
      createdAt: new Date(dto.createdAt),
      creatorUserId: dto.creatorUserId,
      participantProfilePictures: [], // Bu bilgi burada eksik
    };
  }

  /**
   * Maps a Chat entity to a CreateChatCommand.
   */
  static toCreateCommand(
    name: string,
    participantUserIds: string[],
    isGroupChat: boolean
  ): CreateChatCommand {
    return {
      name,
      participantUserIds,
      isGroupChat,
    };
  }

  /**
   * Maps a Chat entity to an UpdateChatCommand.
   */
  static toUpdateCommand(entity: Pick<Chat, "id" | "name">): UpdateChatCommand {
    return {
      id: entity.id,
      name: entity.name,
    };
  }

  /**
   * Maps a list of Chat DTOs to a list of Chat entities.
   */
  static toEntityList(dtos: GetByIdChatResponse[]): Chat[] {
    return dtos.map(ChatMapper.toEntity);
  }

  static toUserChatItemList(
    response: GetUserChatsResponse["chats"]
  ): UserChatItem[] {
    return response.map((chatDto) => ({
      id: chatDto.id,
      name: chatDto.name,
      chatType: chatDto.type === "Group" ? ChatType.Group : ChatType.Private,
      lastMessage: chatDto.lastMessage
        ? {
            content: chatDto.lastMessage.content,
            senderName: chatDto.lastMessage.senderName,
            sentAt: new Date(chatDto.lastMessage.sentDate),
            senderId: "",
          }
        : undefined,
      unreadCount: 0,
      participantProfilePictures: [],
    }));
  }

  static fromCreatedResponse(response: CreateChatResponse): Chat {
    return {
      id: response.id,
      name: response.name,
      isGroupChat: response.isGroupChat,
      createdAt: new Date(response.createdAt),
      creatorUserId: response.creatorUserId,
      participantProfilePictures: [],
    };
  }
}
