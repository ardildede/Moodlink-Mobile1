import { EmotionScore } from "../entities/EmotionScore";
import { PageRequest } from "../../data/dtos/PageRequest";

export enum MoodReportPeriod {
  Daily = 0,
  Weekly = 1,
  Monthly = 2,
  Yearly = 3,
}

export interface MoodReportData {
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

export interface AdvancedMoodAnalysis {
  userId: string;
  analysisData: any;
  patterns: any[];
  recommendations: string[];
}

export interface MoodSummary {
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

/**
 * Repository interface for EmotionScore entity operations
 */
export interface IEmotionScoreRepository {
  /**
   * Creates a new emotion score
   */
  create(emotionScore: Omit<EmotionScore, "id">): Promise<EmotionScore>;

  /**
   * Updates an existing emotion score
   */
  update(emotionScore: EmotionScore): Promise<EmotionScore>;

  /**
   * Deletes an emotion score by ID
   */
  delete(id: string): Promise<boolean>;

  /**
   * Gets an emotion score by ID
   */
  getById(id: string): Promise<EmotionScore | null>;

  /**
   * Gets a list of emotion scores with pagination
   */
  getList(pageRequest: PageRequest): Promise<{
    items: EmotionScore[];
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  }>;

  /**
   * Gets mood report for a user
   */
  getMoodReport(
    userId: string,
    period?: MoodReportPeriod,
    startDate?: Date,
    endDate?: Date
  ): Promise<MoodReportData>;

  /**
   * Gets advanced mood analysis for a user
   */
  getAdvancedAnalysis(
    userId: string,
    analysisDays?: number
  ): Promise<AdvancedMoodAnalysis>;

  /**
   * Gets mood summary for a user on a specific date
   */
  getMoodSummary(userId: string, date?: Date): Promise<MoodSummary>;
}
