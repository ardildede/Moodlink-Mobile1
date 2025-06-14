import {
  IAuthRepository,
  ValidationPurpose,
} from "../../repositories/IAuthRepository";
import { User } from "../../entities/User";

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  userName: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
}

export interface EmailValidationStepResponse {
  isSuccess: boolean;
  message: string;
  expireDate?: Date;
}

export interface EmailVerificationStepResponse {
  isVerified: boolean;
  isSuccess: boolean;
  message: string;
}

export interface RegisterStepResponse {
  accessToken: string;
  user: User;
}

export class RegisterUseCase {
  constructor(private authRepository: IAuthRepository) {}

  // 1. Adım: Email validation kodu gönder
  async sendEmailValidation(
    email: string
  ): Promise<EmailValidationStepResponse> {
    console.log("RegisterUseCase: Step 1 - Sending email validation code...", {
      email,
    });

    if (!this.isValidEmail(email)) {
      throw new Error("Geçerli bir e-posta adresi giriniz");
    }

    try {
      const result = await this.authRepository.sendEmailValidation(email);
      console.log("RegisterUseCase: Email validation code sent successfully");
      return result;
    } catch (error: any) {
      console.error(
        "RegisterUseCase: Failed to send email validation code",
        error
      );
      throw error;
    }
  }

  // 2. Adım: Email kodunu doğrula
  async verifyEmailCode(
    email: string,
    code: string
  ): Promise<EmailVerificationStepResponse> {
    console.log("RegisterUseCase: Step 2 - Verifying email code...", {
      email,
      code: code.substring(0, 2) + "****",
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
        ValidationPurpose.EmailVerification
      );
      console.log("RegisterUseCase: Email code verified successfully");
      return result;
    } catch (error: any) {
      console.error("RegisterUseCase: Failed to verify email code", error);
      throw error;
    }
  }

  // 3. Adım: Kullanıcıyı kaydet (sadece email doğrulandıktan sonra)
  async executeRegister(
    request: RegisterRequest
  ): Promise<RegisterStepResponse> {
    console.log("RegisterUseCase: Step 3 - Executing registration...", {
      email: request.email,
      userName: request.userName,
      firstName: request.firstName,
      lastName: request.lastName,
      hasDateOfBirth: !!request.dateOfBirth,
    });

    this.validateRegisterRequest(request);

    const user: Omit<User, "id" | "followers" | "following" | "createdDate"> = {
      email: request.email,
      userName: request.userName,
      firstName: request.firstName,
      lastName: request.lastName,
      dateOfBirth: request.dateOfBirth,
    };

    try {
      const result = await this.authRepository.register(user, request.password);
      console.log("RegisterUseCase: Registration completed successfully");
      return result;
    } catch (error: any) {
      console.error("RegisterUseCase: Registration failed", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      // Backend'den gelen hata mesajını düzgün parse et
      if (error.response?.data?.title === "Internal server error") {
        if (error.response.data.detail === "AcceptLocales") {
          throw new Error(
            "Sunucu konfigürasyon hatası. Lütfen farklı bir email adresi deneyin."
          );
        }
      }

      throw error;
    }
  }

  // Eski execute metodu - artık 3 adımı birlikte yönetmek için kullanılabilir
  async execute(request: RegisterRequest): Promise<RegisterStepResponse> {
    console.log("RegisterUseCase: Starting full registration process...");

    // Bu method artık sadece 3. adımı çağırıyor
    // Çünkü email validation adımları UI tarafından ayrı ayrı yönetilmeli
    return this.executeRegister(request);
  }

  private validateRegisterRequest(request: RegisterRequest): void {
    // Email validation
    if (!this.isValidEmail(request.email)) {
      throw new Error("Geçerli bir e-posta adresi giriniz");
    }

    // Password validation
    if (!this.isValidPassword(request.password)) {
      throw new Error(
        "Şifre en az 8 karakter olmalı ve büyük harf, küçük harf, rakam ve özel karakter içermelidir"
      );
    }

    // Password confirmation
    if (request.password !== request.confirmPassword) {
      throw new Error("Şifreler eşleşmiyor");
    }

    // Username validation
    if (
      !request.userName ||
      request.userName.trim().length < 3 ||
      request.userName.trim().length > 50
    ) {
      throw new Error("Kullanıcı adı 3-50 karakter arasında olmalıdır");
    }

    // First name validation
    if (
      !request.firstName ||
      request.firstName.trim().length < 2 ||
      request.firstName.trim().length > 50
    ) {
      throw new Error("Ad 2-50 karakter arasında olmalıdır");
    }

    // Last name validation
    if (
      !request.lastName ||
      request.lastName.trim().length < 2 ||
      request.lastName.trim().length > 50
    ) {
      throw new Error("Soyad 2-50 karakter arasında olmalıdır");
    }

    // Date of birth validation
    if (request.dateOfBirth && !this.isValidAge(request.dateOfBirth)) {
      throw new Error("Yaş 13-120 arasında olmalıdır");
    }
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private isValidPassword(password: string): boolean {
    // En az 8 karakter, büyük harf, küçük harf, rakam ve özel karakter
    return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(
      password
    );
  }

  private isValidAge(dateOfBirth: Date): boolean {
    const today = new Date();
    const age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())
    ) {
      return age - 1 >= 13 && age - 1 <= 120;
    }

    return age >= 13 && age <= 120;
  }
}
