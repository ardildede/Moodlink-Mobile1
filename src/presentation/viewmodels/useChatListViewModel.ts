import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { GetUserChatsUseCase } from "../../core/domain/usecases/chat/GetUserChatsUseCase";
import { UserChatItem } from "../../core/domain/entities/Chat";
import { ChatRepositoryImpl } from "../../core/data/repositories/ChatRepositoryImpl";
import ChatApi from "../../core/data/datasources/remote/ChatApi";

const useChatListViewModel = () => {
  const [chats, setChats] = useState<UserChatItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isLoadingRef = useRef(false);
  const hasLoadedInitially = useRef(false);

  // Memoize repository and use case to prevent recreation on every render
  const chatRepository = useMemo(() => new ChatRepositoryImpl(ChatApi), []);
  const getUserChatsUseCase = useMemo(
    () => new GetUserChatsUseCase(chatRepository),
    [chatRepository]
  );

  const fetchChats = useCallback(async () => {
    if (isLoadingRef.current) return; // Prevent multiple simultaneous requests

    isLoadingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const userChats = await getUserChatsUseCase.execute(0, 50);
      setChats(userChats || []); // Ensure array is never undefined
      hasLoadedInitially.current = true;
    } catch (e: any) {
      setError(e.message || "Sohbetler yüklenirken hata oluştu");
      setChats([]); // Set empty array on error
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, [getUserChatsUseCase]);

  // Load data only once on mount - stable dependency
  useEffect(() => {
    if (!hasLoadedInitially.current && !isLoadingRef.current) {
      fetchChats();
    }
  }, [fetchChats]);

  return {
    chats: chats || [], // Ensure chats is always an array
    isLoading,
    error,
    refresh: fetchChats,
  };
};

export default useChatListViewModel;
