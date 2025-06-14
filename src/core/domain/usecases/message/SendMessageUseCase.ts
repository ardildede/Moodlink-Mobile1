import { Message } from "../../entities/Message";
import { IMessageRepository } from "../../repositories/IMessageRepository";

export class SendMessageUseCase {
  constructor(private messageRepository: IMessageRepository) {}

  async execute(
    chatId: string,
    content: string,
    messageType: number = 0
  ): Promise<Message> {
    // İş mantığı kontrolleri
    if (!chatId) {
      throw new Error("Chat ID gereklidir");
    }

    if (!content.trim()) {
      throw new Error("Mesaj içeriği gereklidir");
    }

    if (content.length > 1000) {
      throw new Error("Mesaj içeriği 1000 karakterden fazla olamaz");
    }

    // Repository'yi çağırarak işlemi gerçekleştir
    return this.messageRepository.sendMessage(
      chatId,
      content.trim(),
      messageType
    );
  }

  async sendDirectMessage(
    recipientUserId: string,
    content: string
  ): Promise<Message> {
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
