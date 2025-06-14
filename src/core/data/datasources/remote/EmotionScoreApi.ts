import { API_ENDPOINTS } from "../../../../common/constants/api";
import { PageRequest } from "../../dtos/PageRequest";
import ApiService from "./ApiService";

// EmotionScore DTO interfaces (bu dosyalar muhtemelen eksik, sonra oluşturulmalı)
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

export interface GetListEmotionScoreResponse {
  items: GetByIdEmotionScoreResponse[];
  index: number;
  size: number;
  count: number;
  pages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

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

const EmotionScoreApi = {
  create: async (
    command: CreateEmotionScoreCommand
  ): Promise<CreatedEmotionScoreResponse> => {
    const { data } = await ApiService.post<CreatedEmotionScoreResponse>(
      API_ENDPOINTS.EMOTION_SCORES,
      command
    );
    return data;
  },

  update: async (
    command: UpdateEmotionScoreCommand
  ): Promise<UpdatedEmotionScoreResponse> => {
    const { data } = await ApiService.put<UpdatedEmotionScoreResponse>(
      API_ENDPOINTS.EMOTION_SCORES,
      command
    );
    return data;
  },

  delete: async (id: string): Promise<DeletedEmotionScoreResponse> => {
    const { data } = await ApiService.delete<DeletedEmotionScoreResponse>(
      API_ENDPOINTS.EMOTION_SCORE_BY_ID(id)
    );
    return data;
  },

  getById: async (id: string): Promise<GetByIdEmotionScoreResponse> => {
    const { data } = await ApiService.get<GetByIdEmotionScoreResponse>(
      API_ENDPOINTS.EMOTION_SCORE_BY_ID(id)
    );
    return data;
  },

  getList: async (
    params: PageRequest
  ): Promise<GetListEmotionScoreResponse> => {
    const { data } = await ApiService.get<GetListEmotionScoreResponse>(
      API_ENDPOINTS.EMOTION_SCORES,
      {
        params: {
          PageIndex: params.pageIndex,
          PageSize: params.pageSize,
        },
      }
    );
    return data;
  },

  getMoodReport: async (
    userId: string,
    period: MoodReportPeriod = MoodReportPeriod.Weekly,
    startDate?: Date,
    endDate?: Date
  ): Promise<MoodReportResponse> => {
    const { data } = await ApiService.get<MoodReportResponse>(
      API_ENDPOINTS.GET_MOOD_REPORT(userId),
      {
        params: {
          period,
          startDate: startDate?.toISOString(),
          endDate: endDate?.toISOString(),
        },
      }
    );
    return data;
  },

  getAdvancedAnalysis: async (
    userId: string,
    analysisDays: number = 30
  ): Promise<AdvancedMoodAnalysisResponse> => {
    const { data } = await ApiService.get<AdvancedMoodAnalysisResponse>(
      API_ENDPOINTS.GET_ADVANCED_ANALYSIS(userId),
      {
        params: {
          analysisDays,
        },
      }
    );
    return data;
  },

  getMoodSummary: async (
    userId: string,
    date?: Date
  ): Promise<MoodSummaryResponse> => {
    const { data } = await ApiService.get<MoodSummaryResponse>(
      API_ENDPOINTS.GET_MOOD_SUMMARY(userId),
      {
        params: {
          date: date?.toISOString(),
        },
      }
    );
    return data;
  },
};

export default EmotionScoreApi;
