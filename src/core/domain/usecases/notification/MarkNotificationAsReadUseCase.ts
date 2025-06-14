import { INotificationRepository } from "@/core/domain/repositories/INotificationRepository";

export class MarkNotificationAsReadUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute(notificationId: string): Promise<void> {
    try {
      return await this.notificationRepository.markAsRead(notificationId);
    } catch (error) {
      console.error("MarkNotificationAsReadUseCase error:", error);
      throw error;
    }
  }
}
