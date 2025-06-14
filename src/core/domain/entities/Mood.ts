export interface Mood {
  id: string;
  userId: string;
  moodLevel: number;
  description?: string;
  createdDate: Date;
  updatedDate?: Date;
}

export interface CreateMoodRequest {
  userId: string;
  moodLevel: number;
  description?: string;
}
