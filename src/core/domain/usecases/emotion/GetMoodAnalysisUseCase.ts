import {
  IEmotionScoreRepository,
  MoodReportPeriod,
  MoodReportData,
  AdvancedMoodAnalysis,
  MoodSummary,
} from "../../repositories/IEmotionScoreRepository";

export class GetMoodAnalysisUseCase {
  constructor(private emotionScoreRepository: IEmotionScoreRepository) {}

  async getMoodReport(
    userId: string,
    period: MoodReportPeriod = MoodReportPeriod.Weekly,
    startDate?: Date,
    endDate?: Date
  ): Promise<MoodReportData> {
    if (!userId) {
      throw new Error("Kullanıcı ID'si gereklidir");
    }

    return this.emotionScoreRepository.getMoodReport(
      userId,
      period,
      startDate,
      endDate
    );
  }

  async getAdvancedAnalysis(
    userId: string,
    analysisDays: number = 30
  ): Promise<AdvancedMoodAnalysis> {
    if (!userId) {
      throw new Error("Kullanıcı ID'si gereklidir");
    }

    if (analysisDays < 1 || analysisDays > 365) {
      throw new Error("Analiz günü 1-365 arasında olmalıdır");
    }

    return this.emotionScoreRepository.getAdvancedAnalysis(
      userId,
      analysisDays
    );
  }

  async getMoodSummary(userId: string, date?: Date): Promise<MoodSummary> {
    if (!userId) {
      throw new Error("Kullanıcı ID'si gereklidir");
    }

    return this.emotionScoreRepository.getMoodSummary(userId, date);
  }
}
