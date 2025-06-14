import { GetListResponse } from "./GetListResponse";

export interface CreateEmotionScoreCommand {
  userId: string;
  emotionType: number;
  score: number;
  recordedAt: Date;
}

export interface CreatedEmotionScoreResponse {
  id: string;
  userId: string;
  emotionType: number;
  score: number;
  recordedAt: Date;
}

export interface UpdateEmotionScoreCommand {
  id: string;
  emotionType: number;
  score: number;
  recordedAt: Date;
}

export interface UpdatedEmotionScoreResponse {
  id: string;
  userId: string;
  emotionType: number;
  score: number;
  recordedAt: Date;
}

export interface DeletedEmotionScoreResponse {
  id: string;
}

export interface GetByIdEmotionScoreResponse {
  id: string;
  userId: string;
  emotionType: number;
  score: number;
  recordedAt: Date;
}

export interface GetListEmotionScoreListItemDto {
  id: string;
  userId: string;
  emotionType: number;
  score: number;
  recordedAt: Date;
}

export type GetListEmotionScoreResponse =
  GetListResponse<GetListEmotionScoreListItemDto>;

export interface MoodReportResponse {
  userId: string;
  period: string;
  emotionData: {
    emotionType: number;
    averageScore: number;
    emotionName: string;
  }[];
  trends: any;
  insights: string[];
}

export interface AdvancedMoodAnalysisResponse {
  userId: string;
  analysisData: any;
  patterns: any[];
  recommendations: string[];
}

export interface MoodSummaryResponse {
  userId: string;
  date: Date;
  dominantEmotion: string;
  emotionScores: {
    emotionType: number;
    score: number;
    emotionName: string;
  }[];
  summary: string;
}

export enum MoodReportPeriod {
  Daily = 0,
  Weekly = 1,
  Monthly = 2,
  Yearly = 3,
}
