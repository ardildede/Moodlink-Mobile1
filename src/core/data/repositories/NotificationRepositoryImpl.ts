import { INotificationRepository } from "@/core/domain/repositories/INotificationRepository";
import { NotificationResponse } from "@/core/domain/entities/Notification";
import { NotificationApi } from "../datasources/remote/NotificationApi";

export class NotificationRepositoryImpl implements INotificationRepository {
  async getNotifications(
    pageIndex: number = 0,
    pageSize: number = 100
  ): Promise<NotificationResponse> {
    return await NotificationApi.getNotifications(pageIndex, pageSize);
  }

  async markAsRead(notificationId: string): Promise<void> {
    return await NotificationApi.markAsRead(notificationId);
  }

  async markAllAsRead(): Promise<void> {
    return await NotificationApi.markAllAsRead();
  }
}
