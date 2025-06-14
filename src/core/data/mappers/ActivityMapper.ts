import { Activity } from "../../domain/entities/Activity";
import {
  CreatedActivityResponse,
  GetByIdActivityResponse,
  GetListActivityListItemDto,
  CreateActivityCommand,
  UpdateActivityCommand,
} from "../dtos/ActivityDto";

export class ActivityMapper {
  /**
   * Maps a CreatedActivityResponse to Activity entity
   */
  static toEntity(dto: CreatedActivityResponse): Activity {
    return {
      id: dto.id,
      name: dto.name || "",
      description: dto.description || "",
      eventTime: new Date(dto.eventTime),
      location: dto.location || undefined,
      createdByUserId: dto.createdByUserId,
      category: dto.category || undefined,
      targetMoodDescription: dto.targetMoodDescription || undefined,
      imageUrl: undefined, // activityImageFileId isn't direct URL
      createdAt: new Date(), // Default value since not in DTO
    };
  }

  /**
   * Maps a GetByIdActivityResponse to Activity entity
   */
  static detailedToEntity(dto: GetByIdActivityResponse): Activity {
    return {
      id: dto.id,
      name: dto.name || "",
      description: dto.description || "",
      eventTime: new Date(dto.eventTime),
      location: dto.location || undefined,
      createdByUserId: dto.createdByUserId,
      category: dto.category || undefined,
      targetMoodDescription: dto.targetMoodDescription || undefined,
      imageUrl: undefined, // activityImageFileId isn't direct URL
      createdAt: new Date(), // Default value since not in DTO
      updatedAt: undefined, // Not available in DTO
      createdByUser: undefined, // Not available in DTO
      participantCount: 0, // Default value since not in DTO
      isParticipating: false, // Default value since not in DTO
    };
  }

  /**
   * Maps a GetListActivityListItemDto to Activity entity
   */
  static listItemToEntity(dto: GetListActivityListItemDto): Activity {
    return {
      id: dto.id,
      name: dto.name || "",
      description: dto.description || "",
      eventTime: new Date(dto.eventTime),
      location: dto.location || undefined,
      createdByUserId: dto.createdByUserId,
      category: dto.category || undefined,
      targetMoodDescription: dto.targetMoodDescription || undefined,
      imageUrl: undefined, // activityImageFileId isn't direct URL
      createdAt: new Date(), // Default value since not in DTO
      createdByUser: undefined, // Not available in DTO
      participantCount: 0, // Default value since not in DTO
      isParticipating: false, // Default value since not in DTO
    };
  }

  /**
   * Maps an Activity entity to create DTO request
   */
  static toCreateDto(entity: Activity): CreateActivityCommand {
    return {
      name: entity.name,
      description: entity.description,
      eventTime: entity.eventTime.toISOString(),
      location: entity.location || null,
      createdByUserId: entity.createdByUserId,
      category: entity.category || null,
      targetMoodDescription: entity.targetMoodDescription || null,
      activityImageFileId: null, // This would need to be set separately
    };
  }

  /**
   * Maps an Activity entity to update DTO request
   */
  static toUpdateDto(entity: Activity): UpdateActivityCommand {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      eventTime: entity.eventTime.toISOString(),
      location: entity.location || null,
      createdByUserId: entity.createdByUserId,
      category: entity.category || null,
      targetMoodDescription: entity.targetMoodDescription || null,
      activityImageFileId: null, // This would need to be set separately
      requestingUserId: entity.createdByUserId, // Assuming same user
    };
  }
}
