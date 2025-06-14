import { ApiService } from "./ApiService";
import { API_ENDPOINTS } from "@/common/constants/api";
import { NotificationResponse } from "@/core/domain/entities/Notification";

export class NotificationApi {
  static async getNotifications(
    pageIndex: number = 0,
    pageSize: number = 100
  ): Promise<NotificationResponse> {
    try {
      const response = await ApiService.get(API_ENDPOINTS.NOTIFICATIONS, {
        params: {
          PageIndex: pageIndex,
          PageSize: pageSize,
        },
      });

      return response.data;
    } catch (error: any) {
      console.error("NotificationApi.getNotifications error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch notifications"
      );
    }
  }

  static async markAsRead(notificationId: string): Promise<void> {
    try {
      await ApiService.put(
        `${API_ENDPOINTS.NOTIFICATION_BY_ID(notificationId)}/mark-read`
      );
    } catch (error: any) {
      console.error("NotificationApi.markAsRead error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to mark notification as read"
      );
    }
  }

  static async markAllAsRead(): Promise<void> {
    try {
      await ApiService.put(`${API_ENDPOINTS.NOTIFICATIONS}/mark-all-read`);
    } catch (error: any) {
      console.error("NotificationApi.markAllAsRead error:", error);
      throw new Error(
        error.response?.data?.message ||
          "Failed to mark all notifications as read"
      );
    }
  }
}
