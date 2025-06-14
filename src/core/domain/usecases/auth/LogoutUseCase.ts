import { IAuthRepository } from "../../repositories/IAuthRepository";
import { TokenService } from "@/common/services/TokenService";

export class LogoutUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(): Promise<void> {
    // Sadece local token'ı sil - server'a revoke isteği gönderme
    await TokenService.deleteToken();
  }
}
