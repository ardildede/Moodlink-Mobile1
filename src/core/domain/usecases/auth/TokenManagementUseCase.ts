import { IAuthRepository } from "../../repositories/IAuthRepository";
import { TokenService } from "@/common/services/TokenService";

export class TokenManagementUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async logout(): Promise<void> {
    // Sadece client'daki token'ı güvenli depodan sil
    await TokenService.deleteToken();
    // (ViewModel katmanında) Hafızadaki kullanıcı state'ini temizle
  }
}
