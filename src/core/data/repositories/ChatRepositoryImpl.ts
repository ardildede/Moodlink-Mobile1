import {
  IChatRepository,
  UserChatItem,
} from "../../domain/repositories/IChatRepository";
import { Chat } from "../../domain/entities/Chat";
import { PageRequest } from "../dtos/PageRequest";
import ChatApi from "../datasources/remote/ChatApi";
import { ChatMapper } from "../mappers/ChatMapper";
import { GetListResponse } from "../dtos/GetListResponse";

export class ChatRepositoryImpl implements IChatRepository {
  constructor(private chatApi: typeof ChatApi) {}

  async create(chat: Omit<Chat, "id" | "createdAt">): Promise<Chat> {
    const command = ChatMapper.toCreateCommand(chat.name, [], chat.isGroupChat);
    const response = await this.chatApi.createChat(command);
    return ChatMapper.fromCreatedResponse(response);
  }

  async update(chat: Pick<Chat, "id" | "name">): Promise<Chat> {
    throw new Error("Method not implemented.");
  }

  async delete(id: string): Promise<boolean> {
    await this.chatApi.delete(id);
    return true;
  }

  async getById(id: string): Promise<Chat | null> {
    const response = await this.chatApi.getById(id);
    return ChatMapper.toEntity(response);
  }

  async getList(pageRequest: PageRequest): Promise<GetListResponse<Chat>> {
    const response = await this.chatApi.getList(pageRequest);
    return {
      ...response,
      items: ChatMapper.toEntityList(response.items),
    };
  }

  async getUserChats(pageRequest: PageRequest): Promise<UserChatItem[]> {
    const response = await this.chatApi.getUserChats(pageRequest);
    return ChatMapper.toUserChatItemList(response.chats);
  }
}
