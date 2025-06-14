import {
  IEmotionScoreRepository,
  MoodReportPeriod,
  MoodReportData,
  AdvancedMoodAnalysis,
  MoodSummary,
} from "../../domain/repositories/IEmotionScoreRepository";
import { EmotionScore } from "../../domain/entities/EmotionScore";
import { PageRequest } from "../dtos/PageRequest";
import EmotionScoreApi from "../datasources/remote/EmotionScoreApi";
import { EmotionScoreMapper } from "../mappers/EmotionScoreMapper";

export class EmotionScoreRepositoryImpl implements IEmotionScoreRepository {
  constructor(private emotionScoreApi: typeof EmotionScoreApi) {}

  async create(emotionScore: Omit<EmotionScore, "id">): Promise<EmotionScore> {
    const command = EmotionScoreMapper.toCreateCommand(emotionScore);
    const response = await this.emotionScoreApi.create(command);
    return EmotionScoreMapper.toEntity(response);
  }

  async update(emotionScore: EmotionScore): Promise<EmotionScore> {
    const command = EmotionScoreMapper.toUpdateCommand(emotionScore);
    const response = await this.emotionScoreApi.update(command);
    return EmotionScoreMapper.toEntity(response);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.emotionScoreApi.delete(id);
      return true;
    } catch (error) {
      console.error("Delete emotion score failed:", error);
      return false;
    }
  }

  async getById(id: string): Promise<EmotionScore | null> {
    try {
      const response = await this.emotionScoreApi.getById(id);
      return EmotionScoreMapper.toEntity(response);
    } catch (error) {
      console.error("Get emotion score by ID failed:", error);
      return null;
    }
  }

  async getList(pageRequest: PageRequest): Promise<{
    items: EmotionScore[];
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  }> {
    const response = await this.emotionScoreApi.getList(pageRequest);
    return {
      items: EmotionScoreMapper.toEntityList(response.items),
      pageIndex: response.index,
      pageSize: response.size,
      totalCount: response.count,
      hasPreviousPage: response.hasPrevious,
      hasNextPage: response.hasNext,
    };
  }

  async getMoodReport(
    userId: string,
    period: MoodReportPeriod = MoodReportPeriod.Weekly,
    startDate?: Date,
    endDate?: Date
  ): Promise<MoodReportData> {
    const response = await this.emotionScoreApi.getMoodReport(
      userId,
      period,
      startDate,
      endDate
    );
    return EmotionScoreMapper.toMoodReportEntity(response);
  }

  async getAdvancedAnalysis(
    userId: string,
    analysisDays: number = 30
  ): Promise<AdvancedMoodAnalysis> {
    const response = await this.emotionScoreApi.getAdvancedAnalysis(
      userId,
      analysisDays
    );
    return EmotionScoreMapper.toAdvancedAnalysisEntity(response);
  }

  async getMoodSummary(userId: string, date?: Date): Promise<MoodSummary> {
    const response = await this.emotionScoreApi.getMoodSummary(userId, date);
    return EmotionScoreMapper.toMoodSummaryEntity(response);
  }
}
