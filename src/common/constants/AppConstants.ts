export const AppConstants = {
  APP_NAME: "MoodLink",
  VERSION: "1.0.0",

  // API
  API_TIMEOUT: 10000,

  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,

  // Mood
  MIN_MOOD_LEVEL: 1,
  MAX_MOOD_LEVEL: 10,

  // Cache
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes

  // Storage Keys
  STORAGE_KEYS: {
    AUTH_TOKEN: "@moodlink/auth_token",
    USER_DATA: "@moodlink/user_data",
    SETTINGS: "@moodlink/settings",
  },

  // Error Messages
  ERROR_MESSAGES: {
    NETWORK_ERROR:
      "Ağ bağlantısı hatası. Lütfen internet bağlantınızı kontrol edin.",
    GENERIC_ERROR: "Bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
    UNAUTHORIZED: "Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.",
    VALIDATION_ERROR: "Lütfen tüm gerekli alanları doldurun.",
  },
};
