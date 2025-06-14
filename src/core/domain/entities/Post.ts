import { EmotionScore } from "./EmotionScore";
import { AnalysisStatus } from "../../data/enums/AnalysisStatus";

export interface Post {
  id: string;
  userId: string;
  user: {
    id: string;
    userName: string;
    firstName: string;
    lastName: string;
    profilePictureUrl?: string;
  };
  contentText: string;
  imageUrl?: string;
  createdDate: Date;
  updatedDate?: Date;
  analysisStatus: AnalysisStatus;
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
  likeId?: string;
  emotionScores?: EmotionScore[];
  moodCompatibility?: string;
}
