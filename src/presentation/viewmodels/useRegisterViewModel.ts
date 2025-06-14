import { useState } from "react";
import {
  RegisterUseCase,
  RegisterRequest,
} from "../../core/domain/usecases/auth/RegisterUseCase";
import { EmailValidationUseCase } from "../../core/domain/usecases/auth/EmailValidationUseCase";
import { ValidationPurpose } from "../../core/domain/repositories/IAuthRepository";
import { AuthRepositoryImpl } from "../../core/data/repositories/AuthRepositoryImpl";
import { UserRepositoryImpl } from "../../core/data/repositories/UserRepositoryImpl";
import AuthApi from "../../core/data/datasources/remote/AuthApi";
import UserApi from "../../core/data/datasources/remote/UserApi";
import { GetFromAuthUseCase } from "../../core/domain/usecases/user/GetFromAuthUseCase";
import { TokenService } from "../../common/services/TokenService";
import { useAuthStore } from "../stores/authStore";

export enum RegisterStep {
  EMAIL_INPUT = 1,
  EMAIL_VERIFICATION = 2,
  USER_DETAILS = 3,
  COMPLETED = 4,
}

export interface RegisterFormData {
  email: string;
  verificationCode: string;
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  confirmPassword: string;
  dateOfBirth?: Date;
}

const useRegisterViewModel = () => {
  const { login } = useAuthStore();

  // Dependencies
  const userRepository = new UserRepositoryImpl(UserApi);
  const authRepository = new AuthRepositoryImpl(AuthApi, userRepository);
  const registerUseCase = new RegisterUseCase(authRepository);
  const emailValidationUseCase = new EmailValidationUseCase(authRepository);
  const getFromAuthUseCase = new GetFromAuthUseCase(userRepository);

  // State
  const [currentStep, setCurrentStep] = useState<RegisterStep>(
    RegisterStep.EMAIL_INPUT
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form data
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [formData, setFormData] = useState<Partial<RegisterRequest>>({});

  // Step specific states
  const [emailValidationExpiry, setEmailValidationExpiry] =
    useState<Date | null>(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // 1. Adım: Email validation kodu gönder
  const sendEmailValidation = async (emailAddress: string) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("ViewModel: Sending email validation for registration...", {
        email: emailAddress,
      });

      const result = await registerUseCase.sendEmailValidation(emailAddress);

      if (result.isSuccess) {
        setEmail(emailAddress);
        setEmailValidationExpiry(result.expireDate || null);
        setCurrentStep(RegisterStep.EMAIL_VERIFICATION);
        console.log("ViewModel: Email validation sent successfully");
      } else {
        throw new Error(
          result.message || "Email validation kodu gönderilemedi"
        );
      }
    } catch (err: any) {
      console.error("ViewModel: Email validation failed", err);
      setError(err.message || "Email validation kodu gönderilemedi");
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Adım: Email kodunu doğrula
  const verifyEmailCode = async (code: string) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("ViewModel: Verifying email code for registration...", {
        email,
        code: code.substring(0, 2) + "****",
      });

      const result = await registerUseCase.verifyEmailCode(email, code);

      if (result.isSuccess && result.isVerified) {
        setVerificationCode(code);
        setIsEmailVerified(true);
        setCurrentStep(RegisterStep.USER_DETAILS);
        console.log("ViewModel: Email code verified successfully");
      } else {
        throw new Error(result.message || "Doğrulama kodu geçersiz");
      }
    } catch (err: any) {
      console.error("ViewModel: Email verification failed", err);
      setError(err.message || "Doğrulama kodu geçersiz");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Adım: Kullanıcıyı kaydet
  const completeRegistration = async (userData: RegisterRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("ViewModel: Completing registration...", {
        email: userData.email,
        userName: userData.userName,
      });

      // Email'in doğrulanmış olduğunu kontrol et
      if (!isEmailVerified || userData.email !== email) {
        throw new Error("Email doğrulaması tamamlanmamış");
      }

      const result = await registerUseCase.executeRegister(userData);

      // Token'ı kaydet
      await TokenService.saveToken(result.accessToken);

      // Global state'i güncelle
      login(result.user);

      setCurrentStep(RegisterStep.COMPLETED);
      console.log("ViewModel: Registration completed successfully");

      return result;
    } catch (err: any) {
      console.error("ViewModel: Registration failed", err);
      setError(err.message || "Kayıt işlemi başarısız");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Yardımcı fonksiyonlar
  const resetRegistration = () => {
    setCurrentStep(RegisterStep.EMAIL_INPUT);
    setEmail("");
    setVerificationCode("");
    setFormData({});
    setIsEmailVerified(false);
    setEmailValidationExpiry(null);
    setError(null);
  };

  const goBackToStep = (step: RegisterStep) => {
    if (step < currentStep) {
      setCurrentStep(step);
      setError(null);
    }
  };

  // Email validation kodunu yeniden gönder
  const resendEmailValidation = async () => {
    if (email) {
      await sendEmailValidation(email);
    }
  };

  return {
    // State
    currentStep,
    isLoading,
    error,
    successMessage,
    email,
    verificationCode,
    formData,
    emailValidationExpiry,
    isEmailVerified,

    // Actions
    sendEmailValidation,
    verifyEmailCode,
    completeRegistration,
    resetRegistration,
    goBackToStep,
    resendEmailValidation,

    // Setters
    setFormData,
    setError,
  };
};

export { useRegisterViewModel };

export default useRegisterViewModel;
