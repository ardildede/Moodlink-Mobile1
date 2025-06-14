import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "accessToken";

export const TokenService = {
  async saveToken(accessToken: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
      console.log("Access token saved securely.");
    } catch (error) {
      console.error("Error saving access token securely", error);
      throw new Error("Token güvenli bir şekilde saklanamadı.");
    }
  },

  async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error("Error getting access token", error);
      return null;
    }
  },

  async deleteToken(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
      console.log("Access token deleted successfully.");
    } catch (error) {
      console.error("Error deleting access token", error);
      // Hata olsa bile devam et, en azından denendi.
    }
  },
};
