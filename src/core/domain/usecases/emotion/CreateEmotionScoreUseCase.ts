import {
  EmotionScore,
  EmotionScoreOwnerType,
  EmotionType,
} from "../../entities/EmotionScore";
import { IEmotionScoreRepository } from "../../repositories/IEmotionScoreRepository";

export class CreateEmotionScoreUseCase {
  constructor(private emotionScoreRepository: IEmotionScoreRepository) {}

  async execute(
    ownerId: string,
    ownerType: EmotionScoreOwnerType,
    emotionType: EmotionType,
    score: number
  ): Promise<EmotionScore> {
    // İş mantığı kontrolleri
    if (!ownerId) {
      throw new Error("Owner ID gereklidir");
    }

    if (score < 0 || score > 100) {
      throw new Error("Duygu skoru 0-100 arasında olmalıdır");
    }

    // EmotionScore entity'sini oluştur
    const emotionScore: Omit<EmotionScore, "id"> = {
      ownerId,
      ownerType,
      emotionType,
      score,
    };

    // Repository'yi çağırarak işlemi gerçekleştir
    return this.emotionScoreRepository.create(emotionScore);
  }
}
