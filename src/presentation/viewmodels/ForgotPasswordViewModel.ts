import { useState } from "react";
import { Alert } from "react-native";

export interface ForgotPasswordViewModelState {
  email: string;
  isLoading: boolean;
  setEmail: (email: string) => void;
  sendResetEmail: () => Promise<void>;
}

export const useForgotPasswordViewModel = (): ForgotPasswordViewModelState => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const sendResetEmail = async () => {
    if (!email) {
      Alert.alert("Hata", "Lütfen e-posta adresinizi girin");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Hata", "Geçerli bir e-posta adresi girin");
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement actual forgot password use case here
      // Example: await forgotPasswordUseCase.execute(email);

      // Simulate API call for now
      setTimeout(() => {
        setIsLoading(false);
        Alert.alert(
          "Başarılı",
          "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen e-postanızı kontrol edin."
        );
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      Alert.alert(
        "Hata",
        "Şifre sıfırlama bağlantısı gönderilirken bir hata oluştu"
      );
    }
  };

  return {
    email,
    isLoading,
    setEmail,
    sendResetEmail,
  };
};
