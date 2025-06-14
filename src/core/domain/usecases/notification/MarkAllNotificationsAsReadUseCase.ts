import { INotificationRepository } from "@/core/domain/repositories/INotificationRepository";

export class MarkAllNotificationsAsReadUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute(): Promise<void> {
    try {
      return await this.notificationRepository.markAllAsRead();
    } catch (error) {
      console.error("MarkAllNotificationsAsReadUseCase error:", error);
      throw error;
    }
  }
}
