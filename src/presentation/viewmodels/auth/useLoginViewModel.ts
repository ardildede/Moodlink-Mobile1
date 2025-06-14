import { useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import { LoginUseCase } from "../../../core/domain/usecases/auth/LoginUseCase";
import { TokenService } from "../../../common/services/TokenService";
import { GetFromAuthUseCase } from "../../../core/domain/usecases/user/GetFromAuthUseCase";
import { AuthRepositoryImpl } from "../../../core/data/repositories/AuthRepositoryImpl";
import AuthApi from "../../../core/data/datasources/remote/AuthApi";
import { UserRepositoryImpl } from "../../../core/data/repositories/UserRepositoryImpl";
import UserApi from "../../../core/data/datasources/remote/UserApi";

// Manuel instantiation
const authRepository = new AuthRepositoryImpl(
  AuthApi,
  new UserRepositoryImpl(UserApi)
);
const loginUseCase = new LoginUseCase(authRepository);

const userRepository = new UserRepositoryImpl(UserApi);
const getFromAuthUseCase = new GetFromAuthUseCase(userRepository);

interface FormData {
  email: string;
  password: string;
}

export function useLoginViewModel() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const {
    login: setGlobalAuth,
    isLoading,
    error,
    setLoading,
    setError,
  } = useAuthStore();

  const setEmail = (email: string) => {
    setFormData((prev) => ({ ...prev, email }));
    if (error) setError(null); // Clear error when user starts typing
  };

  const setPassword = (password: string) => {
    setFormData((prev) => ({ ...prev, password }));
    if (error) setError(null); // Clear error when user starts typing
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.password) {
      setError("E-posta ve şifre alanları zorunludur.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Geçerli bir e-posta adresi giriniz.");
      return false;
    }

    return true;
  };

  const handleError = (err: any): string => {
    console.error("Login failed:", err);

    if (err.isAxiosError && !err.response) {
      return "Ağ bağlantınızı kontrol edin veya sunucunun çalıştığından emin olun.";
    }

    return (
      err.response?.data?.Detail ||
      err.response?.data?.message ||
      err.message ||
      "Giriş yapılırken beklenmeyen bir hata oluştu."
    );
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Login and get token
      const { accessToken } = await loginUseCase.execute(
        formData.email,
        formData.password
      );

      // 2. Save token securely
      await TokenService.saveToken(accessToken);

      // 3. Get user info with saved token
      const user = await getFromAuthUseCase.execute();

      // 4. Update global auth state
      setGlobalAuth(user);
    } catch (err: any) {
      const errorMessage = handleError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    email: formData.email,
    password: formData.password,
    isLoading,
    error,
    setEmail,
    setPassword,
    handleLogin,
  };
}
