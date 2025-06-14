export interface User {
  id: string;
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  bio?: string;
  profileImageUrl?: string;
  createdDate: Date;
  followers: number;
  following: number;
  isFollowing?: boolean;
  moodCompatibility?: string;
  authenticatorType?: string;
  profilePictureUrl?: string;
}

export interface FollowerUser {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
}

export interface FollowingUser {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
}
