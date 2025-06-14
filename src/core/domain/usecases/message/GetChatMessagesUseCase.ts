import { Message } from "../../entities/Message";
import { IMessageRepository } from "../../repositories/IMessageRepository";
import { PageRequest } from "../../../data/dtos/PageRequest";

export class GetChatMessagesUseCase {
  constructor(private messageRepository: IMessageRepository) {}

  async execute(
    chatId: string,
    pageIndex: number = 0,
    pageSize: number = 20
  ): Promise<{
    items: Message[];
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  }> {
    // İş mantığı kontrolleri
    if (!chatId) {
      throw new Error("Chat ID gereklidir");
    }

    if (pageIndex < 0) {
      throw new Error("Sayfa indeksi 0'dan küçük olamaz");
    }

    if (pageSize < 1 || pageSize > 100) {
      throw new Error("Sayfa boyutu 1-100 arasında olmalıdır");
    }

    const pageRequest: PageRequest = {
      pageIndex,
      pageSize,
    };

    // Repository'yi çağırarak işlemi gerçekleştir
    return this.messageRepository.getChatMessages(chatId, pageRequest);
  }
}
