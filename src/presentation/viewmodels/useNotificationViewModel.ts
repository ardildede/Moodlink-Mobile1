import { useState, useEffect, useCallback } from "react";
import {
  Notification,
  NotificationResponse,
} from "@/core/domain/entities/Notification";
import { GetNotificationsUseCase } from "@/core/domain/usecases/notification/GetNotificationsUseCase";
import { NotificationRepositoryImpl } from "@/core/data/repositories/NotificationRepositoryImpl";

// Instantiate dependencies
const notificationRepository = new NotificationRepositoryImpl();
const getNotificationsUseCase = new GetNotificationsUseCase(
  notificationRepository
);

interface NotificationState {
  notifications: Notification[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  pageIndex: number;
  pageSize: number;
  hasMore: boolean;
}

export const useNotificationViewModel = () => {
  const [state, setState] = useState<NotificationState>({
    notifications: [],
    isLoading: false,
    isRefreshing: false,
    error: null,
    pageIndex: 0,
    pageSize: 20,
    hasMore: true,
  });

  const updateState = (updates: Partial<NotificationState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const handleError = (error: any, defaultMessage: string) => {
    console.error("Notification operation error:", error);
    const message = error instanceof Error ? error.message : defaultMessage;
    updateState({ error: message });
  };

  const loadNotifications = useCallback(
    async (refresh: boolean = false) => {
      const currentPageIndex = refresh ? 0 : state.pageIndex;

      updateState({
        [refresh ? "isRefreshing" : "isLoading"]: true,
        error: null,
      });

      try {
        const response: NotificationResponse =
          await getNotificationsUseCase.execute(
            currentPageIndex,
            state.pageSize
          );

        const newNotifications = refresh
          ? response.items
          : [...state.notifications, ...response.items];

        updateState({
          notifications: newNotifications,
          pageIndex: refresh ? 1 : currentPageIndex + 1,
          hasMore: response.hasNext,
        });
      } catch (err) {
        handleError(err, "Bildirimler yüklenirken hata oluştu");
      } finally {
        updateState({
          isLoading: false,
          isRefreshing: false,
        });
      }
    },
    [state.pageIndex, state.pageSize, state.notifications]
  );

  const refreshNotifications = useCallback(async () => {
    await loadNotifications(true);
  }, [loadNotifications]);

  const loadMoreNotifications = useCallback(async () => {
    if (!state.hasMore || state.isLoading) return;
    await loadNotifications(false);
  }, [state.hasMore, state.isLoading, loadNotifications]);

  const getNotificationTypeText = (type: number): string => {
    switch (type) {
      case 1:
        return "Beğeni";
      case 2:
        return "Yorum";
      case 3:
        return "Takip";
      case 4:
        return "Sistem";
      default:
        return "Bilinmeyen";
    }
  };

  const getNotificationIcon = (type: number): string => {
    switch (type) {
      case 1:
        return "heart";
      case 2:
        return "chatbubble";
      case 3:
        return "person-add";
      case 4:
        return "notifications";
      default:
        return "alert-circle";
    }
  };

  useEffect(() => {
    loadNotifications(true);
  }, []);

  return {
    ...state,
    refreshNotifications,
    loadMoreNotifications,
    getNotificationTypeText,
    getNotificationIcon,
  };
};
