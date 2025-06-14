import { useState } from "react";
import { Alert } from "react-native";

export interface SignupViewModelState {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  isLoading: boolean;
  setUsername: (username: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  signup: () => Promise<void>;
}

export const useSignupViewModel = (): SignupViewModelState => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun");
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert("Hata", "Şifreler eşleşmiyor");
      return false;
    }

    if (password.length < 6) {
      Alert.alert("Hata", "Şifre en az 6 karakter olmalıdır");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Hata", "Geçerli bir e-posta adresi girin");
      return false;
    }

    return true;
  };

  const signup = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement actual signup use case here
      // Example: await signupUseCase.execute(username, email, password);

      // Simulate API call for now
      setTimeout(() => {
        setIsLoading(false);
        Alert.alert(
          "Başarılı",
          "Hesabınız oluşturuldu! Şimdi giriş yapabilirsiniz."
        );
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Hata", "Hesap oluşturulurken bir hata oluştu");
    }
  };

  return {
    username,
    email,
    password,
    confirmPassword,
    isLoading,
    setUsername,
    setEmail,
    setPassword,
    setConfirmPassword,
    signup,
  };
};
