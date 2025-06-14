import { API_ENDPOINTS } from "../../../../common/constants/api";
import { PageRequest } from "../../dtos/PageRequest";
import {
  CreateChatCommand,
  CreateChatResponse,
  UpdateChatCommand,
  UpdatedChatResponse,
  DeletedChatResponse,
  GetByIdChatResponse,
  GetListChatResponse,
  GetUserChatsResponse,
} from "../../dtos/ChatDto";
import ApiService from "./ApiService";

const ChatApi = {
  createChat: async (
    command: CreateChatCommand
  ): Promise<CreateChatResponse> => {
    const { data } = await ApiService.post<CreateChatResponse>(
      API_ENDPOINTS.CREATE_CHAT,
      command
    );
    return data;
  },

  getUserChats: async (params: PageRequest): Promise<GetUserChatsResponse> => {
    const { data } = await ApiService.get<GetUserChatsResponse>(
      API_ENDPOINTS.GET_USER_CHATS,
      {
        params: {
          PageIndex: params.pageIndex,
          PageSize: params.pageSize,
        },
      }
    );
    return data;
  },

  getById: async (id: string): Promise<GetByIdChatResponse> => {
    const { data } = await ApiService.get<GetByIdChatResponse>(
      API_ENDPOINTS.CHAT_BY_ID(id)
    );
    return data;
  },

  update: async (command: UpdateChatCommand): Promise<UpdatedChatResponse> => {
    const { data } = await ApiService.put<UpdatedChatResponse>(
      API_ENDPOINTS.CHATS,
      command
    );
    return data;
  },

  delete: async (id: string): Promise<DeletedChatResponse> => {
    const { data } = await ApiService.delete<DeletedChatResponse>(
      API_ENDPOINTS.CHAT_BY_ID(id)
    );
    return data;
  },

  getList: async (params: PageRequest): Promise<GetListChatResponse> => {
    const { data } = await ApiService.get<GetListChatResponse>(
      API_ENDPOINTS.CHATS,
      {
        params: {
          PageIndex: params.pageIndex,
          PageSize: params.pageSize,
        },
      }
    );
    return data;
  },
};

export default ChatApi;
