import { API_ENDPOINTS } from "../../../../common/constants/api";
import {
  CreateMessageCommand,
  CreatedMessageResponse,
  UpdateMessageCommand,
  UpdatedMessageResponse,
  GetListMessageResponse,
  GetChatMessagesResponse,
  DeletedMessageResponse,
  GetByIdMessageResponse,
  SendMessageCommand,
  SendMessageResponse,
  SendDirectMessageCommand,
  SendDirectMessageResponse,
} from "../../dtos/MessageDto";
import { PageRequest } from "../../dtos/PageRequest";
import ApiService from "./ApiService";

const MessageApi = {
  createMessage: async (
    command: CreateMessageCommand
  ): Promise<CreatedMessageResponse> => {
    const { data } = await ApiService.post<CreatedMessageResponse>(
      API_ENDPOINTS.MESSAGES,
      command
    );
    return data;
  },

  sendMessage: async (
    command: SendMessageCommand
  ): Promise<SendMessageResponse> => {
    const { data } = await ApiService.post<SendMessageResponse>(
      API_ENDPOINTS.SEND_MESSAGE,
      command
    );
    return data;
  },

  sendDirectMessage: async (
    command: SendDirectMessageCommand
  ): Promise<SendDirectMessageResponse> => {
    const { data } = await ApiService.post<SendDirectMessageResponse>(
      API_ENDPOINTS.SEND_DIRECT_MESSAGE,
      command
    );
    return data;
  },

  updateMessage: async (
    command: UpdateMessageCommand
  ): Promise<UpdatedMessageResponse> => {
    const { data } = await ApiService.put<UpdatedMessageResponse>(
      API_ENDPOINTS.MESSAGES,
      command
    );
    return data;
  },

  getMessages: async (params: PageRequest): Promise<GetListMessageResponse> => {
    const { data } = await ApiService.get<GetListMessageResponse>(
      API_ENDPOINTS.MESSAGES,
      { params: { PageIndex: params.pageIndex, PageSize: params.pageSize } }
    );
    return data;
  },

  getChatMessages: async (
    chatId: string,
    params: PageRequest
  ): Promise<GetChatMessagesResponse> => {
    const { data } = await ApiService.get<GetChatMessagesResponse>(
      API_ENDPOINTS.GET_CHAT_MESSAGES(chatId),
      { params: { PageIndex: params.pageIndex, PageSize: params.pageSize } }
    );
    return data;
  },

  deleteMessage: async (id: string): Promise<DeletedMessageResponse> => {
    const { data } = await ApiService.delete<DeletedMessageResponse>(
      API_ENDPOINTS.MESSAGE_BY_ID(id)
    );
    return data;
  },

  getMessageById: async (id: string): Promise<GetByIdMessageResponse> => {
    const { data } = await ApiService.get<GetByIdMessageResponse>(
      API_ENDPOINTS.MESSAGE_BY_ID(id)
    );
    return data;
  },
};

export default MessageApi;
