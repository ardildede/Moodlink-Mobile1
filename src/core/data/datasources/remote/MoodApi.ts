import ApiService from "./ApiService";

export interface MoodReportResponse {
  success: boolean;
  page: number;
  pageSize: number;
  totalCount: number;
  userMoodProfile: {
    emotionType: number;
    score: number;
  }[];
  activities: {
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
    targetEmotions: {
      emotionType: number;
      score: number;
    }[];
    recommendationReason: string;
  }[];
  message: string;
}

const MoodApi = {
  getMoodReport: async (
    pageIndex: number,
    pageSize: number
  ): Promise<MoodReportResponse> => {
    const { data } = await ApiService.get<MoodReportResponse>(
      `/api/MoodBasedRecommendation/activities`,
      {
        params: {
          PageIndex: pageIndex,
          PageSize: pageSize,
        },
      }
    );
    return data;
  },
};

export default MoodApi;
