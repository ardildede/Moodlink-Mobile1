import { Message } from "../../entities/Message";
import { IMessageRepository } from "../../repositories/IMessageRepository";

export class UpdateMessageUseCase {
  constructor(private messageRepository: IMessageRepository) {}

  async execute(messageId: string, content: string): Promise<Message> {
    // İş mantığı kontrolleri
    if (!messageId) {
      throw new Error("Mesaj ID'si gereklidir");
    }

    if (!content.trim()) {
      throw new Error("Mesaj içeriği gereklidir");
    }

    if (content.length > 1000) {
      throw new Error("Mesaj içeriği 1000 karakterden fazla olamaz");
    }

    // Repository'yi çağırarak işlemi gerçekleştir
    return this.messageRepository.update({
      id: messageId,
      content: content.trim(),
    });
  }
}
