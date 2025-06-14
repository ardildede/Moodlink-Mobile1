import { create } from "zustand";
import { User } from "@/core/domain/entities/User";
import { LogoutUseCase } from "@/core/domain/usecases/auth/LogoutUseCase";
import { AuthRepositoryImpl } from "@/core/data/repositories/AuthRepositoryImpl";
import AuthApi from "@/core/data/datasources/remote/AuthApi";
import { UserRepositoryImpl } from "@/core/data/repositories/UserRepositoryImpl";
import UserApi from "@/core/data/datasources/remote/UserApi";

// Manuel instantiation
const userRepository = new UserRepositoryImpl(UserApi);
const authRepository = new AuthRepositoryImpl(AuthApi, userRepository);
const logoutUseCase = new LogoutUseCase(authRepository);

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (user: User) => void;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isLoading: true, // Başlangıçta true - uygulama açılırken token kontrolü yapıyoruz
  error: null,

  // Actions
  login: (user: User) => {
    set({
      user,
      isAuthenticated: true,
      isLoading: false, // Loading'i false yap ki splash screen kapansın
      error: null,
    });
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await logoutUseCase.execute();
      set({
        user: null,
        isAuthenticated: false,
        error: null,
      });
    } catch (error: any) {
      console.error("Logout failed:", error);
      set({
        error: "Çıkış yaparken bir hata oluştu.",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },
}));

// ApiService callback'i AppNavigator'da ayarlanacak
