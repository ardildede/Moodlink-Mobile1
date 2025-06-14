import { Post } from "../../domain/entities/Post";
import { EmotionScore } from "../../domain/entities/EmotionScore";
import {
  CreatedPostResponse,
  GetByIdPostResponse,
  GetListPostListItemDto,
  GetFollowedUsersPostsListItemDto,
  PostEmotionScoreDto,
  MoodRecommendedPostDto,
} from "../dtos/PostDto";

export class PostMapper {
  /**
   * Maps a PostDto to Post entity - works for both CreatedPostResponse and GetByIdPostResponse
   */
  static toEntity(dto: CreatedPostResponse | GetByIdPostResponse): Post {
    // Handle CreatedPostResponse (minimal data)
    if (!("user" in dto)) {
      return {
        id: dto.id,
        userId: dto.userId,
        user: {
          id: dto.userId,
          userName: "",
          firstName: "",
          lastName: "",
        },
        contentText: dto.contentText || "",
        createdDate: new Date(),
        analysisStatus: dto.analysisStatus,
        likesCount: 0,
        commentsCount: 0,
      };
    }

    // Handle GetByIdPostResponse (detailed data)
    return {
      id: dto.id,
      userId: dto.userId,
      user: {
        id: dto.user.id,
        userName: dto.user.userName,
        firstName: dto.user.firstName,
        lastName: dto.user.lastName,
        profilePictureUrl: dto.user.profilePictureUrl,
      },
      contentText: dto.contentText || "",
      imageUrl: dto.postImageUrl,
      createdDate: new Date(dto.createdDate),
      updatedDate: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      analysisStatus: dto.analysisStatus,
      likesCount: dto.likeCount,
      commentsCount: dto.commentCount,
      isLiked: dto.isLikedByCurrentUser,
      likeId: dto.likeId,
      emotionScores: dto.emotionScores?.map(
        (es: PostEmotionScoreDto): EmotionScore => ({
          id: "",
          ownerId: dto.id,
          ownerType: 1,
          emotionType: es.emotionType,
          score: es.score,
        })
      ),
    };
  }

  /**
   * Maps a GetByIdPostDto to Post entity
   */
  static detailedToEntity(dto: GetByIdPostResponse): Post {
    return this.toEntity(dto);
  }

  /**
   * Maps a GetListPostItemDto to Post entity
   */
  static listItemToEntity(dto: GetListPostListItemDto): Post {
    return {
      id: dto.id,
      userId: dto.userId,
      user: {
        id: dto.user.id,
        userName: dto.user.userName,
        firstName: dto.user.firstName,
        lastName: dto.user.lastName,
        profilePictureUrl: dto.user.profilePictureUrl,
      },
      contentText: dto.contentText || "",
      imageUrl: dto.postImageUrl,
      createdDate: new Date(dto.createdDate),
      updatedDate: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      analysisStatus: dto.analysisStatus,
      likesCount: dto.likeCount,
      commentsCount: dto.commentCount,
      isLiked: dto.isLikedByCurrentUser,
      likeId: dto.likeId,
      emotionScores: dto.emotionScores?.map(
        (es: PostEmotionScoreDto): EmotionScore => ({
          id: "",
          ownerId: dto.id,
          ownerType: 1,
          emotionType: es.emotionType,
          score: es.score,
        })
      ),
    };
  }

  /**
   * Maps a GetFollowedUsersPostsItemDto to Post entity
   */
  static followedPostToEntity(dto: GetFollowedUsersPostsListItemDto): Post {
    // Prioritize userName if available, otherwise construct from first/last name
    const displayName =
      dto.userName ||
      (dto.userFirstName || dto.userLastName
        ? `${dto.userFirstName || ""} ${dto.userLastName || ""}`.trim()
        : "Kullanıcı");

    return {
      id: dto.id,
      userId: dto.userId,
      user: {
        id: dto.userId,
        userName: displayName,
        firstName: dto.userFirstName || "",
        lastName: dto.userLastName || "",
        profilePictureUrl: undefined,
      },
      contentText: dto.contentText || "",
      imageUrl: dto.postImageFileId ? undefined : undefined,
      createdDate: new Date(dto.createdDate),
      updatedDate: undefined,
      analysisStatus: dto.analysisStatus,
      likesCount: dto.likesCount || 0,
      commentsCount: dto.commentsCount || 0,
      isLiked: (dto as any).isLikedByCurrentUser || false,
      moodCompatibility: dto.moodCompatibility?.toString(),
      likeId: (dto as any).likeId,
    };
  }

  /**
   * Maps user posts API response to Post entity (different format from list API)
   */
  static userPostToEntity(dto: any): Post {
    return {
      id: dto.id,
      userId: dto.userId,
      user: {
        id: dto.userId,
        userName: dto.userName || "",
        firstName: dto.userFirstName || "",
        lastName: dto.userLastName || "",
        profilePictureUrl: undefined,
      },
      contentText: dto.contentText || "",
      imageUrl: dto.postImageFileId ? undefined : undefined,
      createdDate: new Date(dto.createdDate),
      updatedDate: undefined,
      analysisStatus: dto.analysisStatus,
      likesCount: dto.likesCount || 0,
      commentsCount: dto.commentsCount || 0,
      isLiked: dto.isLikedByCurrentUser || false,
      likeId: (dto as any).likeId,
    };
  }

  /**
   * Maps mood recommended posts API response to Post entity
   */
  static moodRecommendedPostToEntity(dto: MoodRecommendedPostDto): Post {
    // fullName'i parse et: "Ad Soyad" formatında geliyor
    const nameParts = dto.fullName?.split(" ") || [];
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    return {
      id: dto.id,
      userId: dto.userId,
      user: {
        id: dto.userId,
        userName: dto.userName,
        firstName: firstName,
        lastName: lastName,
        profilePictureUrl: undefined,
      },
      contentText: dto.contentText || "",
      imageUrl: undefined,
      createdDate: new Date(dto.createdDate),
      updatedDate: undefined,
      analysisStatus: dto.analysisStatus,
      likesCount: dto.likesCount || 0,
      commentsCount: dto.commentsCount || 0,
      isLiked: dto.isLikedByUser || false,
      likeId: undefined, // API'de likeId field'ı yok
      emotionScores: dto.emotionScores?.map(
        (es: PostEmotionScoreDto): EmotionScore => ({
          id: "",
          ownerId: dto.id,
          ownerType: 1,
          emotionType: es.emotionType,
          score: es.score,
        })
      ),
      moodCompatibility: dto.moodCompatibility?.toString(),
    };
  }

  /**
   * Maps a Post entity to create DTO request
   */
  static toCreateDto(entity: Post): {
    userId: string;
    contentText: string;
    postImageFileId?: string;
  } {
    return {
      userId: entity.userId,
      contentText: entity.contentText,
      postImageFileId: entity.imageUrl ? undefined : undefined,
    };
  }

  /**
   * Maps a Post entity to update DTO request
   */
  static toUpdateDto(entity: Post): {
    id: string;
    contentText: string;
    postImageFileId?: string;
  } {
    return {
      id: entity.id,
      contentText: entity.contentText,
      postImageFileId: entity.imageUrl ? undefined : undefined,
    };
  }
}
