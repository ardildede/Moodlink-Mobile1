import {
  IChatRepository,
  UserChatItem,
} from "../../repositories/IChatRepository";
import { PageRequest } from "../../../data/dtos/PageRequest";

export class GetUserChatsUseCase {
  constructor(private chatRepository: IChatRepository) {}

  async execute(
    pageIndex: number = 0,
    pageSize: number = 20
  ): Promise<UserChatItem[]> {
    // İş mantığı kontrolleri
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
    return this.chatRepository.getUserChats(pageRequest);
  }
}
