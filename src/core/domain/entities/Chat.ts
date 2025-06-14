import { ChatParticipant } from "./ChatParticipant";
import { Message } from "./Message";

export interface Chat {
  id: string;
  name: string;
  isGroupChat: boolean;
  creatorUserId: string;
  createdAt: Date;
  participantProfilePictures: (string | undefined)[];
}

export enum ChatType {
  Private,
  Group,
}

export interface UserChatItem {
  id: string;
  name: string;
  chatType: ChatType;
  lastMessage?: {
    content: string;
    senderId: string;
    senderName: string;
    sentAt: Date;
  };
  unreadCount: number;
  participantProfilePictures: (string | undefined)[];
}
