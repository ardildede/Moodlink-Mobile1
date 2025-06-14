import { useState } from "react";
import { Alert } from "react-native";

export interface LoginViewModelState {
  username: string;
  password: string;
  isLoading: boolean;
  setUsername: (username: string) => void;
  setPassword: (password: string) => void;
  login: () => Promise<void>;
  loginWithGoogle: () => void;
}

export const useLoginViewModel = (
  onAuthenticated: () => void
): LoginViewModelState => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const login = async () => {
    if (!username || !password) {
      Alert.alert("Hata", "Lütfen kullanıcı adı ve şifrenizi girin");
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement actual authentication use case here
      // Example: await loginUseCase.execute(username, password);

      // Simulate API call for now
      setTimeout(() => {
        setIsLoading(false);
        onAuthenticated();
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Hata", "Giriş yapılırken bir hata oluştu");
    }
  };

  const loginWithGoogle = () => {
    Alert.alert("Bilgi", "Google ile giriş özelliği yakında gelecek");
  };

  return {
    username,
    password,
    isLoading,
    setUsername,
    setPassword,
    login,
    loginWithGoogle,
  };
};
