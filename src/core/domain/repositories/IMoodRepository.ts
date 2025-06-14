import { Post } from "../entities/Post";
import { EmotionScore, EmotionType } from "../entities/EmotionScore";
import { MoodCompatibility } from "../entities/MoodCompatibility";
import { MoodReport } from "../entities/MoodReport";
import { Mood, CreateMoodRequest } from "../entities/Mood";

export interface IMoodRepository {
  /**
   * Creates a new mood entry for a user.
   * @param moodData The mood data to create.
   * @returns A promise that resolves to the created Mood object.
   */
  createMood(moodData: CreateMoodRequest): Promise<Mood>;

  /**
   * Fetches the mood compatibility score between two users from the backend.
   * @param userId1 The ID of the first user.
   * @param userId2 The ID of the second user.
   * @returns A promise that resolves to a MoodCompatibility object.
   */
  getMoodCompatibility(
    userId1: string,
    userId2: string
  ): Promise<MoodCompatibility>;

  /**
   * Sends post content to the backend for emotion analysis.
   * @param post The post to be analyzed.
   * @returns A promise that resolves to an array of EmotionScore objects.
   */
  analyzePostContent(post: Post): Promise<EmotionScore[]>;

  /**
   * Fetches a user's overall mood analysis based on recent posts.
   * @param userId The ID of the user.
   * @param sampleSize The number of recent posts to consider for analysis.
   * @returns A promise that resolves to an object containing the dominant emotion and detailed scores.
   */
  analyzeUserMood(
    userId: string,
    sampleSize: number
  ): Promise<{
    dominantEmotion: EmotionType;
    emotionScores: Record<EmotionType, number>;
  }>;
}
