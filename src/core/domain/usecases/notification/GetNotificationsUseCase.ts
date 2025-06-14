import { INotificationRepository } from "@/core/domain/repositories/INotificationRepository";
import { NotificationResponse } from "@/core/domain/entities/Notification";

export class GetNotificationsUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute(
    pageIndex: number = 0,
    pageSize: number = 100
  ): Promise<NotificationResponse> {
    try {
      return await this.notificationRepository.getNotifications(
        pageIndex,
        pageSize
      );
    } catch (error) {
      console.error("GetNotificationsUseCase error:", error);
      throw error;
    }
  }
}
