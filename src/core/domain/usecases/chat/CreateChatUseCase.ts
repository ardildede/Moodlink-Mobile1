import { Chat, ChatType } from "../../entities/Chat";
import { IChatRepository } from "../../repositories/IChatRepository";

export class CreateChatUseCase {
  constructor(private chatRepository: IChatRepository) {}

  async execute(
    name: string,
    participantUserIds: string[],
    chatType: ChatType,
    creatorUserId: string
  ): Promise<Chat> {
    // İş mantığı kontrolleri
    if (!name.trim()) {
      throw new Error("Chat adı gereklidir");
    }

    if (name.length > 100) {
      throw new Error("Chat adı 100 karakterden fazla olamaz");
    }

    if (!participantUserIds || participantUserIds.length === 0) {
      throw new Error("En az bir katılımcı gereklidir");
    }

    if (chatType === ChatType.Group && participantUserIds.length < 2) {
      throw new Error("Grup chat'i için en az 2 katılımcı gereklidir");
    }

    if (!creatorUserId) {
      throw new Error("Chat oluşturucu ID'si gereklidir");
    }

    // Chat entity'sini oluştur
    const chat: Omit<Chat, "id" | "createdAt"> = {
      name: name.trim(),
      isGroupChat: chatType === ChatType.Group,
      creatorUserId: creatorUserId,
      participantProfilePictures: [],
    };

    // Repository'yi çağırarak işlemi gerçekleştir
    return this.chatRepository.create(chat);
  }
}
