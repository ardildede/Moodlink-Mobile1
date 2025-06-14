export interface EmotionScore {
  emotionType: number;
  score: number;
}

export interface UserMoodProfile {
  emotionType: number;
  score: number;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  eventTime: string;
  location?: string;
  category: string;
  targetMoodDescription: string;
  createdByUserId: string;
  createdByUserName: string;
  therapeuticScore: number;
  targetEmotions: EmotionScore[];
  recommendationReason: string;
}

export interface MoodReport {
  success: boolean;
  page: number;
  pageSize: number;
  totalCount: number;
  userMoodProfile: UserMoodProfile[];
  activities: Activity[];
  message: string;
}
