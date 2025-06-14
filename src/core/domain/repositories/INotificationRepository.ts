import { NotificationResponse } from "../entities/Notification";

export interface INotificationRepository {
  getNotifications(
    pageIndex?: number,
    pageSize?: number
  ): Promise<NotificationResponse>;
  markAsRead(notificationId: string): Promise<void>;
  markAllAsRead(): Promise<void>;
}
