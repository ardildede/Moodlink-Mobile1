import { IMessageRepository } from "../../repositories/IMessageRepository";

export class DeleteMessageUseCase {
  constructor(private messageRepository: IMessageRepository) {}

  async execute(messageId: string): Promise<boolean> {
    // İş mantığı kontrolleri
    if (!messageId) {
      throw new Error("Mesaj ID'si gereklidir");
    }

    // Repository'yi çağırarak işlemi gerçekleştir
    return this.messageRepository.delete(messageId);
  }
}
