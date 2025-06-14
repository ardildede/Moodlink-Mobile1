import { Message } from "../../entities/Message";
import { IMessageRepository } from "../../repositories/IMessageRepository";

export class SendDirectMessageUseCase {
  constructor(private messageRepository: IMessageRepository) {}

  async execute(recipientUserId: string, content: string): Promise<Message> {
    // İş mantığı kontrolleri
    if (!recipientUserId) {
      throw new Error("Alıcı kullanıcı ID'si gereklidir");
    }

    if (!content.trim()) {
      throw new Error("Mesaj içeriği gereklidir");
    }

    if (content.length > 1000) {
      throw new Error("Mesaj içeriği 1000 karakterden fazla olamaz");
    }

    // Repository'yi çağırarak işlemi gerçekleştir
    return this.messageRepository.sendDirectMessage(
      recipientUserId,
      content.trim()
    );
  }
}
