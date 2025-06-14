import { useState } from "react";
import { ResetPasswordUseCase } from "../../../core/domain/usecases/auth/ResetPasswordUseCase";
import { AuthRepositoryImpl } from "../../../core/data/repositories/AuthRepositoryImpl";
import AuthApi from "../../../core/data/datasources/remote/AuthApi";
import { UserRepositoryImpl } from "../../../core/data/repositories/UserRepositoryImpl";
import UserApi from "../../../core/data/datasources/remote/UserApi";

// Manual instantiation
const userRepository = new UserRepositoryImpl(UserApi);
const authRepository = new AuthRepositoryImpl(AuthApi, userRepository);
const resetPasswordUseCase = new ResetPasswordUseCase(authRepository);

export type ForgotPasswordStep = "email" | "code" | "password";

export function useForgotPasswordViewModel() {
  const [currentStep, setCurrentStep] = useState<ForgotPasswordStep>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const sendResetCode = async (): Promise<boolean> => {
    if (!email.trim()) {
      setError("Lütfen e-posta adresinizi girin");
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await resetPasswordUseCase.sendResetCode(email);

      if (result.isSuccess) {
        setCurrentStep("code");
        return true;
      } else {
        setError(result.message || "Kod gönderilirken bir hata oluştu");
        return false;
      }
    } catch (error: any) {
      setError(error.message || "Beklenmeyen bir hata oluştu");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async (): Promise<boolean> => {
    if (!code.trim()) {
      setError("Lütfen doğrulama kodunu girin");
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await resetPasswordUseCase.verifyResetCode(email, code);

      if (result.isSuccess) {
        setCurrentStep("password");
        return true;
      } else {
        setError(result.message || "Kod doğrulanamadı");
        return false;
      }
    } catch (error: any) {
      setError(error.message || "Beklenmeyen bir hata oluştu");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (): Promise<boolean> => {
    if (!newPassword.trim()) {
      setError("Lütfen yeni şifrenizi girin");
      return false;
    }

    if (newPassword !== confirmPassword) {
      setError("Şifreler eşleşmiyor");
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await resetPasswordUseCase.resetPassword(
        email,
        code,
        newPassword
      );

      if (result.isSuccess) {
        return true;
      } else {
        setError(result.message || "Şifre sıfırlanırken bir hata oluştu");
        return false;
      }
    } catch (error: any) {
      setError(error.message || "Beklenmeyen bir hata oluştu");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const goBackToEmail = () => {
    setCurrentStep("email");
    setCode("");
    setError(null);
  };

  const goBackToCode = () => {
    setCurrentStep("code");
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
  };

  const resetAll = () => {
    setCurrentStep("email");
    setEmail("");
    setCode("");
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
  };

  return {
    // State
    currentStep,
    email,
    code,
    newPassword,
    confirmPassword,
    isLoading,
    error,

    // Actions
    setEmail,
    setCode,
    setNewPassword,
    setConfirmPassword,
    sendResetCode,
    verifyCode,
    resetPassword,
    clearError,
    goBackToEmail,
    goBackToCode,
    resetAll,
  };
}
