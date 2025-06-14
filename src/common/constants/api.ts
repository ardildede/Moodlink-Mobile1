import config from "../../common/config";

// Use the URL from the environment configuration
export const API_BASE_URL = config.API_BASE_URL;

export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/api/Auth/Login",
  REGISTER: "/api/Auth/Register",
  REFRESH_TOKEN: "/api/Auth/RefreshToken",
  REVOKE_TOKEN: "/api/Auth/RevokeToken",
  SEND_PASSWORD_RESET_CODE: "/api/Auth/SendPasswordResetCode",
  VERIFY_CODE: "/api/Auth/VerifyCode",
  RESET_PASSWORD: "/api/Auth/ResetPassword",

  // New Auth Endpoints from Swagger
  ENABLE_EMAIL_AUTHENTICATOR: "/api/Auth/EnableEmailAuthenticator",
  ENABLE_OTP_AUTHENTICATOR: "/api/Auth/EnableOtpAuthenticator",
  VERIFY_EMAIL_AUTHENTICATOR: "/api/Auth/VerifyEmailAuthenticator", // Takes ActivationKey as query param
  VERIFY_OTP_AUTHENTICATOR: "/api/Auth/VerifyOtpAuthenticator",
  SEND_EMAIL_VALIDATION: "/api/Auth/SendEmailValidation",

  // User
  USERS: "/api/Users",
  GET_USER_BY_ID: (userId: string) => `/api/Users/${userId}`,
  GET_USER_FROM_AUTH: "/api/Users/GetFromAuth",
  UPDATE_USER_FROM_AUTH: "/api/Users/FromAuth",

  // Search
  SEARCH: "/api/Search",

  // Follows
  FOLLOWS: "/api/Follows",
  FOLLOW_BY_ID: (id: string) => `/api/Follows/${id}`,
  // Backend'te bu endpoint'ler yok, kaldırıldı:
  // FOLLOW_USER: (userId: string) => `/api/Users/${userId}/follow`,
  // UNFOLLOW_USER: (userId: string) => `/api/Users/${userId}/unfollow`,
  GET_FOLLOWERS: (userId: string) => `/api/Users/${userId}/followers`,
  GET_FOLLOWING: (userId: string) => `/api/Users/${userId}/following`,
  // IS_FOLLOWING endpoint'i de backend'te yok:
  // IS_FOLLOWING: (userId: string, followId: string) => `/api/Users/${userId}/following/${followId}`,

  // Post
  POSTS: "/api/Posts",
  GET_POST_BY_ID: (postId: string) => `/api/Posts/${postId}`,
  GET_USER_POSTS: (userId: string) => `/api/Posts/user/${userId}`,
  GET_FOLLOWED_USERS_POSTS: (userId: string) =>
    `/api/Posts/followed-users/${userId}`,
  GET_POST_LIKES: (postId: string) => `/api/Posts/${postId}/likes`,
  GET_COMMENT_LIKES: (commentId: string) => `/api/Comments/${commentId}/likes`,
  LIKE_BY_ID: (id: string) => `/api/Likes/${id}`,

  // Comment
  COMMENTS: "/api/Comments",
  GET_POST_COMMENTS: (postId: string) => `/api/Posts/${postId}/comments`,
  GET_COMMENT_BY_ID: (commentId: string) => `/api/Comments/${commentId}`,

  // Like
  LIKES: "/api/Likes",
  UNLIKE_POST: (userId: string, postId: string) =>
    `/api/Likes/user/${userId}/post/${postId}`,

  // Badges
  BADGES: "/api/Badges",
  BADGE_BY_ID: (id: string) => `/api/Badges/${id}`,

  // Chats
  CHATS: "/api/Chats",
  CHAT_BY_ID: (id: string) => `/api/Chats/${id}`,
  CREATE_CHAT: "/api/Chats/create",
  GET_USER_CHATS: "/api/Chats/user-chats",

  // Chat Participants
  CHAT_PARTICIPANTS: "/api/ChatParticipants",
  CHAT_PARTICIPANT_BY_ID: (id: string) => `/api/ChatParticipants/${id}`,

  // EmotionScores
  EMOTION_SCORES: "/api/EmotionScores",
  EMOTION_SCORE_BY_ID: (id: string) => `/api/EmotionScores/${id}`,
  GET_MOOD_REPORT: (userId: string) =>
    `/api/EmotionScores/mood-report/${userId}`,
  GET_ADVANCED_ANALYSIS: (userId: string) =>
    `/api/EmotionScores/advanced-analysis/${userId}`,
  GET_MOOD_SUMMARY: (userId: string) =>
    `/api/EmotionScores/mood-summary/${userId}`,

  // Activities
  ACTIVITIES: "/api/Activities",
  ACTIVITY_BY_ID: (id: string) => `/api/Activities/${id}`,
  GET_USER_CREATED_ACTIVITIES: (userId: string) =>
    `/api/Activities/user/${userId}/created`,
  GET_USER_PARTICIPATED_ACTIVITIES: (userId: string) =>
    `/api/Activities/user/${userId}/participated`,
  GET_USER_ACTIVITY_STATS: (userId: string) =>
    `/api/Activities/user/${userId}/stats`,

  // Activity Participations
  ACTIVITY_PARTICIPATIONS: "/api/ActivityParticipations",
  ACTIVITY_PARTICIPATION_BY_ID: (id: string) =>
    `/api/ActivityParticipations/${id}`,

  // Messages
  MESSAGES: "/api/Messages",
  MESSAGE_BY_ID: (id: string) => `/api/Messages/${id}`,
  SEND_MESSAGE: "/api/Messages/send",
  SEND_DIRECT_MESSAGE: "/api/Messages/send-direct",
  GET_CHAT_MESSAGES: (chatId: string) => `/api/Messages/chat/${chatId}`,

  // Mood & Recommendations
  GET_MOOD_RECOMMENDED_POSTS: "/api/MoodBasedRecommendation/posts",
  GET_MOOD_RECOMMENDED_ACTIVITIES: "/api/MoodBasedRecommendation/activities",
  GET_MOOD_RECOMMENDED_USERS: "/api/MoodBasedRecommendation/users",
  GET_USER_MOOD_COMPATIBILITY: (targetUserId: string) =>
    `/api/MoodBasedRecommendation/users/${targetUserId}/compatibility`,

  // Notifications
  NOTIFICATIONS: "/api/Notifications",
  NOTIFICATION_BY_ID: (id: string) => `/api/Notifications/${id}`,

  // FileAttachments
  FILE_ATTACHMENTS: "/api/FileAttachments",
  FILE_ATTACHMENT_BY_ID: (id: string) => `/api/FileAttachments/${id}`,
  DOWNLOAD_FILE_ATTACHMENT: (id: string) =>
    `/api/FileAttachments/download/${id}`,
};
