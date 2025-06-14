import { IUserProfileRepository } from "../../repositories/IUserProfileRepository";
import { IFollowRepository } from "../../repositories/IFollowRepository";
import { User } from "../../entities/User";
import { MoodCompatibilityResult } from "../../entities/MoodCompatibility";

export interface UserCoreProfileData {
  user: User;
  moodCompatibility: MoodCompatibilityResult | null;
  isFollowing: boolean;
  followId?: string;
}

export class GetUserCoreProfileUseCase {
  constructor(
    private userProfileRepository: IUserProfileRepository,
    private followRepository: IFollowRepository
  ) {}

  async execute(
    targetUserId: string,
    currentUserId: string
  ): Promise<UserCoreProfileData> {
    try {
      // Get core data in parallel
      const [user, moodCompatibility, followDetails] = await Promise.all([
        this.userProfileRepository.getUserById(targetUserId),
        this.getMoodCompatibilityOrNull(targetUserId),
        this.followRepository.getFollowDetails(currentUserId, targetUserId),
      ]);

      return {
        user,
        moodCompatibility,
        isFollowing: followDetails.isFollowing,
        followId: followDetails.followId,
      };
    } catch (error) {
      console.error("Get user core profile failed:", error);
      throw new Error("Kullanıcı ana profili yüklenemedi.");
    }
  }

  private async getMoodCompatibilityOrNull(
    targetUserId: string
  ): Promise<MoodCompatibilityResult | null> {
    try {
      return await this.userProfileRepository.getMoodCompatibility(
        targetUserId
      );
    } catch (error) {
      console.warn("Mood compatibility could not be loaded:", error);
      return null;
    }
  }
}
