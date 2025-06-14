import {
  MoodReport,
  Activity,
  UserMoodProfile,
} from "../../domain/entities/MoodReport";
import { MoodReportResponse } from "../datasources/remote/MoodApi";

export class MoodMapper {
  /**
   * Maps MoodReportResponse DTO to MoodReport entity
   */
  static toEntity(dto: MoodReportResponse): MoodReport {
    return {
      success: dto.success,
      page: dto.page,
      pageSize: dto.pageSize,
      totalCount: dto.totalCount,
      userMoodProfile: dto.userMoodProfile.map((profile) => ({
        emotionType: profile.emotionType,
        score: profile.score,
      })),
      activities: dto.activities.map((activity) => ({
        id: activity.id,
        name: activity.name,
        description: activity.description,
        eventTime: activity.eventTime,
        location: activity.location,
        category: activity.category,
        targetMoodDescription: activity.targetMoodDescription,
        createdByUserId: activity.createdByUserId,
        createdByUserName: activity.createdByUserName,
        therapeuticScore: activity.therapeuticScore,
        targetEmotions: activity.targetEmotions.map((emotion) => ({
          emotionType: emotion.emotionType,
          score: emotion.score,
        })),
        recommendationReason: activity.recommendationReason,
      })),
      message: dto.message,
    };
  }
}
