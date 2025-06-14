import {
  EmotionScore,
  EmotionScoreOwnerType,
} from "../../domain/entities/EmotionScore";
import {
  CreateEmotionScoreCommand,
  CreatedEmotionScoreResponse,
  UpdateEmotionScoreCommand,
  UpdatedEmotionScoreResponse,
  GetByIdEmotionScoreResponse,
  MoodReportResponse,
  AdvancedMoodAnalysisResponse,
  MoodSummaryResponse,
} from "../datasources/remote/EmotionScoreApi";

export class EmotionScoreMapper {
  /**
   * Maps a CreatedEmotionScoreResponse to an EmotionScore entity.
   */
  static toEntity(
    dto:
      | CreatedEmotionScoreResponse
      | GetByIdEmotionScoreResponse
      | UpdatedEmotionScoreResponse
  ): EmotionScore {
    return {
      id: dto.id,
      ownerId: dto.userId,
      ownerType: EmotionScoreOwnerType.User,
      emotionType: dto.emotionType,
      score: dto.score,
    };
  }

  /**
   * Maps an EmotionScore entity to a CreateEmotionScoreCommand.
   */
  static toCreateCommand(
    entity: Omit<EmotionScore, "id">,
    recordedAt: Date = new Date()
  ): CreateEmotionScoreCommand {
    return {
      userId: entity.ownerId,
      emotionType: entity.emotionType,
      score: entity.score,
      recordedAt: recordedAt,
    };
  }

  /**
   * Maps an EmotionScore entity to an UpdateEmotionScoreCommand.
   */
  static toUpdateCommand(
    entity: EmotionScore,
    recordedAt: Date = new Date()
  ): UpdateEmotionScoreCommand {
    return {
      id: entity.id,
      emotionType: entity.emotionType,
      score: entity.score,
      recordedAt: recordedAt,
    };
  }

  /**
   * Maps a list of EmotionScore DTOs to a list of EmotionScore entities.
   */
  static toEntityList(dtos: GetByIdEmotionScoreResponse[]): EmotionScore[] {
    return dtos.map(EmotionScoreMapper.toEntity);
  }

  /**
   * Maps MoodReportResponse to a more usable format
   */
  static toMoodReportEntity(dto: MoodReportResponse) {
    return {
      userId: dto.userId,
      period: dto.period,
      emotionData: dto.emotionData.map((emotion) => ({
        emotionType: emotion.emotionType,
        averageScore: emotion.averageScore,
        emotionName: emotion.emotionName,
      })),
      trends: dto.trends,
      insights: dto.insights,
    };
  }

  /**
   * Maps AdvancedMoodAnalysisResponse to a more usable format
   */
  static toAdvancedAnalysisEntity(dto: AdvancedMoodAnalysisResponse) {
    return {
      userId: dto.userId,
      analysisData: dto.analysisData,
      patterns: dto.patterns,
      recommendations: dto.recommendations,
    };
  }

  /**
   * Maps MoodSummaryResponse to a more usable format
   */
  static toMoodSummaryEntity(dto: MoodSummaryResponse) {
    return {
      userId: dto.userId,
      date: new Date(dto.date),
      dominantEmotion: dto.dominantEmotion,
      emotionScores: dto.emotionScores.map((score) => ({
        emotionType: score.emotionType,
        score: score.score,
        emotionName: score.emotionName,
      })),
      summary: dto.summary,
    };
  }
}
