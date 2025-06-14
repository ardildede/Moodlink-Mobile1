import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Message } from "../../core/domain/entities/Message";
import { GetChatMessagesUseCase } from "../../core/domain/usecases/message/GetChatMessagesUseCase";
import { SendMessageUseCase } from "../../core/domain/usecases/message/SendMessageUseCase";
import { SendDirectMessageUseCase } from "../../core/domain/usecases/message/SendDirectMessageUseCase";
import { GetUserChatsUseCase } from "../../core/domain/usecases/chat/GetUserChatsUseCase";
import { MessageRepositoryImpl } from "../../core/data/repositories/MessageRepositoryImpl";
import { ChatRepositoryImpl } from "../../core/data/repositories/ChatRepositoryImpl";
import MessageApi from "../../core/data/datasources/remote/MessageApi";
import ChatApi from "../../core/data/datasources/remote/ChatApi";
import { useAuthStore } from "../stores/authStore";

const useConversationViewModel = (
  initialChatId: string | null,
  recipientUserId: string | null,
  recipientUserName?: string
) => {
  const { user } = useAuthStore();

  // Reduced logging for performance
  if (__DEV__) {
    console.log("🔄 useConversationViewModel", {
      initialChatId: initialChatId ? "exists" : "null",
      recipientUserId: recipientUserId ? "exists" : "null",
    });
  }

  // State
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatId, setChatId] = useState<string | null>(initialChatId);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const [messageText, setMessageText] = useState("");

  // Refs to prevent multiple calls and track state
  const loadingRef = useRef(false);
  const sendingRef = useRef(false);
  const loadedChatsRef = useRef<Set<string>>(new Set());
  const currentChatIdRef = useRef<string | null>(initialChatId);
  const mountedRef = useRef(true);

  // Static instances - initialize with null to fix linter errors
  const messageRepositoryRef = useRef<MessageRepositoryImpl | null>(null);
  const chatRepositoryRef = useRef<ChatRepositoryImpl | null>(null);
  const useCasesRef = useRef<{
    getChatMessages: GetChatMessagesUseCase;
    sendMessage: SendMessageUseCase;
    sendDirectMessage: SendDirectMessageUseCase;
    getUserChats: GetUserChatsUseCase;
  } | null>(null);

  // Initialize use cases once
  if (!messageRepositoryRef.current) {
    messageRepositoryRef.current = new MessageRepositoryImpl(MessageApi);
    chatRepositoryRef.current = new ChatRepositoryImpl(ChatApi);
    useCasesRef.current = {
      getChatMessages: new GetChatMessagesUseCase(messageRepositoryRef.current),
      sendMessage: new SendMessageUseCase(messageRepositoryRef.current),
      sendDirectMessage: new SendDirectMessageUseCase(
        messageRepositoryRef.current
      ),
      getUserChats: new GetUserChatsUseCase(chatRepositoryRef.current),
    };
  }

  // Find existing chat with recipient using GetUserChats use case
  const findExistingChat = async (recipientId: string) => {
    if (!useCasesRef.current) return null;

    try {
      if (__DEV__) {
        console.log("Searching for existing chat with recipient:", recipientId);
      }

      // Get user chats to find existing conversation
      const userChats = await useCasesRef.current.getUserChats.execute(0, 50);

      // Find a chat that contains the recipient by name
      const existingChat = userChats.find((chat) => {
        // Match by chat name (assuming chat name is the recipient's name for direct messages)
        return chat.name === recipientUserName && chat.chatType === 0; // ChatType.Private = 0
      });

      if (existingChat) {
        if (__DEV__) {
          console.log("Found existing chat:", existingChat.id);
        }
        return existingChat.id;
      }

      return null;
    } catch (error) {
      if (__DEV__) {
        console.log("Error finding existing chat:", error);
      }
    }

    return null;
  };

  // Find or create chat function
  const findOrCreateChat = async (recipientId: string) => {
    if (!recipientId || !mountedRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      // First try to find existing chat
      const existingChatId = await findExistingChat(recipientId);

      if (existingChatId && mountedRef.current) {
        // Found existing chat, load it
        setChatId(existingChatId);
        currentChatIdRef.current = existingChatId;
        if (__DEV__) {
          console.log("Loading existing chat messages");
        }
        await loadMessages(0, existingChatId);
      } else {
        // No existing chat found, ready for new conversation
        if (__DEV__) {
          console.log("Ready for new conversation");
        }
      }

      if (mountedRef.current) {
        setIsLoading(false);
      }
    } catch (e: any) {
      if (__DEV__) {
        console.log("Error preparing conversation:", e.message);
      }
      if (mountedRef.current) {
        setError(e.message || "Sohbet oluşturulurken hata oluştu");
        setIsLoading(false);
      }
    }
  };

  // Load messages function
  const loadMessages = async (page: number, targetChatId: string) => {
    if (!targetChatId || !mountedRef.current || !useCasesRef.current) return;
    if (loadingRef.current) return;
    if (page === 0 && loadedChatsRef.current.has(targetChatId)) return;

    loadingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const result = await useCasesRef.current.getChatMessages.execute(
        targetChatId,
        page,
        20
      );

      if (!mountedRef.current) return;

      // Ensure items is always an array to prevent map errors
      const items = result.items || [];
      setMessages((prev) => (page === 0 ? items : [...prev, ...items]));
      setHasMore(result.hasNextPage || false);
      setPageIndex(page);

      if (page === 0) {
        loadedChatsRef.current.add(targetChatId);
        if (__DEV__) {
          console.log("Messages loaded:", items.length);
        }
      }
    } catch (e: any) {
      if (__DEV__) {
        console.log("Error loading messages:", e.message);
      }
      if (mountedRef.current) {
        setError(e.message || "Mesajlar yüklenirken hata oluştu");
      }
    } finally {
      loadingRef.current = false;
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  // Handle chat ID changes - Optimized
  useEffect(() => {
    if (currentChatIdRef.current !== initialChatId) {
      if (__DEV__) {
        console.log("Chat ID changed", {
          from: currentChatIdRef.current,
          to: initialChatId,
        });
      }
      currentChatIdRef.current = initialChatId;
      setChatId(initialChatId);
      setMessages([]);
      setPageIndex(0);
      setHasMore(true);
      setError(null);
      loadedChatsRef.current.clear();
    }
  }, [initialChatId]);

  // Load initial messages - Optimized
  useEffect(() => {
    if (chatId && !loadedChatsRef.current.has(chatId)) {
      if (__DEV__) {
        console.log("Loading messages for chat:", chatId);
      }
      loadMessages(0, chatId);
    } else if (!chatId && recipientUserId) {
      if (__DEV__) {
        console.log("Preparing new conversation");
      }
      findOrCreateChat(recipientUserId);
    }
  }, [chatId, recipientUserId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Send message function - Memoized
  const handleSendMessage = useCallback(async () => {
    if (
      !messageText.trim() ||
      sendingRef.current ||
      !mountedRef.current ||
      !useCasesRef.current
    )
      return;

    const content = messageText.trim();
    sendingRef.current = true;
    setIsSending(true);
    setMessageText("");
    setError(null);

    try {
      let newMessage: Message;

      if (chatId) {
        newMessage = await useCasesRef.current.sendMessage.execute(
          chatId,
          content
        );
      } else if (recipientUserId) {
        newMessage = await useCasesRef.current.sendDirectMessage.execute(
          recipientUserId,
          content
        );
        setChatId(newMessage.chatId);
        currentChatIdRef.current = newMessage.chatId;
      } else {
        throw new Error("Sohbet veya alıcı bilgisi bulunamadı.");
      }

      if (mountedRef.current) {
        // Ensure senderId is set correctly for the new message
        const messageWithCorrectSender: Message = {
          ...newMessage,
          senderId: newMessage.senderId || user?.id || "",
          sentAt: newMessage.sentAt || new Date(),
        };

        setMessages((prev) => [messageWithCorrectSender, ...(prev || [])]);
      }
    } catch (e: any) {
      if (mountedRef.current) {
        setError(e.message || "Mesaj gönderilirken hata oluştu");
        setMessageText(content);
      }
    } finally {
      sendingRef.current = false;
      if (mountedRef.current) {
        setIsSending(false);
      }
    }
  }, [chatId, recipientUserId, messageText]);

  // Load more messages - Memoized
  const loadMoreMessages = useCallback(() => {
    if (hasMore && !loadingRef.current && chatId && mountedRef.current) {
      loadMessages(pageIndex + 1, chatId);
    }
  }, [hasMore, chatId, pageIndex]);

  // Clear error - Memoized
  const clearError = useCallback(() => {
    if (mountedRef.current) {
      setError(null);
    }
  }, []);

  // Memoize return object to prevent unnecessary re-renders
  const returnValue = useMemo(
    () => ({
      messages: messages || [],
      chatId,
      isLoading,
      isSending,
      error,
      hasMore,
      pageIndex,
      messageText,
      setMessageText,
      handleSendMessage,
      loadMoreMessages,
      clearError,
    }),
    [
      messages,
      chatId,
      isLoading,
      isSending,
      error,
      hasMore,
      pageIndex,
      messageText,
      handleSendMessage,
      loadMoreMessages,
      clearError,
    ]
  );

  return returnValue;
};

export default useConversationViewModel;
