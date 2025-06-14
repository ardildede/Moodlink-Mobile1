import {
  IAuthRepository,
  ValidationPurpose,
} from "../../repositories/IAuthRepository";

export class EmailValidationUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async sendEmailValidation(email: string): Promise<{
    isSuccess: boolean;
    message: string;
    expireDate?: Date;
  }> {
    console.log("EmailValidationUseCase: Sending email validation code...", {
      email,
    });

    if (!this.isValidEmail(email)) {
      throw new Error("Geçerli bir e-posta adresi giriniz");
    }

    try {
      const result = await this.authRepository.sendEmailValidation(email);
      console.log(
        "EmailValidationUseCase: Email validation code sent successfully"
      );
      return result;
    } catch (error: any) {
      console.error(
        "EmailValidationUseCase: Failed to send email validation code",
        error
      );
      throw error;
    }
  }

  async verifyEmailCode(
    email: string,
    code: string,
    validationType: ValidationPurpose = ValidationPurpose.EmailVerification
  ): Promise<{
    isVerified: boolean;
    isSuccess: boolean;
    message: string;
  }> {
    console.log("EmailValidationUseCase: Verifying email code...", {
      email,
      code: code.substring(0, 2) + "****",
      validationType,
    });

    if (!this.isValidEmail(email)) {
      throw new Error("Geçerli bir e-posta adresi giriniz");
    }

    if (!code || code.trim().length !== 6) {
      throw new Error("Geçerli bir 6 haneli doğrulama kodu giriniz");
    }

    if (!/^\d{6}$/.test(code.trim())) {
      throw new Error("Doğrulama kodu sadece rakam içermelidir");
    }

    try {
      const result = await this.authRepository.verifyEmailCode(
        email,
        code,
        validationType
      );
      console.log("EmailValidationUseCase: Email code verified successfully", {
        isVerified: result.isVerified,
        isSuccess: result.isSuccess,
      });
      return result;
    } catch (error: any) {
      console.error(
        "EmailValidationUseCase: Failed to verify email code",
        error
      );
      throw error;
    }
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
