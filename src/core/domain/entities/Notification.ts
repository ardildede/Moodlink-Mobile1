import { User } from "./User";

export interface Notification {
  id: string;
  userId: string;
  type: number;
  content: string;
  relatedEntityId: string | null;
  relatedEntityType: string | null;
  isRead: boolean;
}

export interface NotificationResponse {
  items: Notification[];
  index: number;
  size: number;
  count: number;
  pages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export enum NotificationType {
  System = 0,
  NewFollower = 1,
  NewLike = 2,
  NewComment = 3,
  ActivityInvitation = 4,
  NewMessage = 5,
  NewBadge = 6,
}
