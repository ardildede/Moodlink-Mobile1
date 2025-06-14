import { useState, useEffect, useCallback } from "react";
import { UserProfile } from "../../core/domain/entities/UserProfile";
import { GetUserProfileUseCase } from "../../core/domain/usecases/user/GetUserProfileUseCase";
import { UserRepositoryImpl } from "../../core/data/repositories/UserRepositoryImpl";
import UserApi from "../../core/data/datasources/remote/UserApi";

// Instantiate dependencies
const userRepository = new UserRepositoryImpl(UserApi);
const getUserProfileUseCase = new GetUserProfileUseCase(userRepository);

export const useProfileViewModel = (userId?: string) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userProfile = await getUserProfileUseCase.execute(userId);
      setProfile(userProfile);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Profil yüklenirken hata oluştu"
      );
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const refreshProfile = useCallback(() => {
    loadProfile();
  }, [loadProfile]);

  // Format mood values for display
  const getMoodDisplayText = useCallback(() => {
    if (!profile?.moodValues || profile.moodValues.length === 0)
      return "Mood bilgisi yok";

    // Get top 2 mood values
    const topMoods = profile.moodValues
      .sort((a, b) => b.score - a.score)
      .slice(0, 2);

    return topMoods
      .map((mood) => `${mood.emotionName} %${mood.score}`)
      .join(", ");
  }, [profile]);

  // Get badge emojis for display
  const getBadgeEmojis = useCallback(() => {
    if (!profile?.badges || profile.badges.length === 0) return [];

    // Return badge emojis (assuming badge has emoji property)
    return profile.badges
      .slice(0, 5) // Show max 5 badges
      .map((userBadge) => userBadge.badge?.name || "🏆"); // Fallback to trophy
  }, [profile]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    profile,
    isLoading,
    error,
    refreshProfile,
    getMoodDisplayText,
    getBadgeEmojis,
  };
};
