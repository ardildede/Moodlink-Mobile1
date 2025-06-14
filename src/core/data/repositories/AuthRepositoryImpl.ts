import {
  IAuthRepository,
  ValidationPurpose,
} from "../../domain/repositories/IAuthRepository";
import { User } from "../../domain/entities/User";
import AuthApi from "../datasources/remote/AuthApi";
import { TokenService } from "../../../common/services/TokenService";
import { EnhancedUserForRegisterDto, UserForLoginDto } from "../dtos/AuthDto";
import { IUserRepository } from "../../domain/repositories/IUserRepository";

export class AuthRepositoryImpl implements IAuthRepository {
  constructor(
    private authApi: typeof AuthApi,
    private userRepository: IUserRepository
  ) {}

  async login(
    email: string,
    password: string,
    authenticatorCode?: string
  ): Promise<{ accessToken: string; user: User | null }> {
    const loginDto: UserForLoginDto = {
      email,
      password,
      authenticatorCode,
    };
    const responseDto = await this.authApi.login(loginDto);

    const accessToken = responseDto.accessToken.token;

    return {
      accessToken,
      user: null, // User is fetched separately in the ViewModel
    };
  }

  async register(
    user: Omit<User, "id" | "followers" | "following" | "createdDate">,
    password: string
  ): Promise<{ accessToken: string; user: User }> {
    const registerDto: EnhancedUserForRegisterDto = {
      ...user,
      password: password,
    };

    console.log("AuthRepositoryImpl: Sending register request to backend...", {
      email: registerDto.email,
      userName: registerDto.userName,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      hasDateOfBirth: !!registerDto.dateOfBirth,
    });

    try {
      const responseDto = await this.authApi.register(registerDto);

      // Debug: Backend response'ını log'la
      console.log(
        "Register API Response:",
        JSON.stringify(responseDto, null, 2)
      );

      // Backend response'unda token'ı bul - farklı formatlarda olabilir
      let accessToken: string | undefined;

      if (responseDto.token) {
        // Backend direkt token field'ı gönderiyor
        accessToken = responseDto.token;
        console.log("Token found in 'token' field");
      } else if (responseDto.accessToken?.token) {
        // Wrapped format
        accessToken = responseDto.accessToken.token;
        console.log("Token found in 'accessToken.token' field");
      }

      if (!accessToken) {
        console.log("No token in register response, attempting login...");
        const loginResult = await this.login(user.email, password);
        return {
          accessToken: loginResult.accessToken,
          user: await this.userRepository.getFromAuth(),
        };
      }

      console.log("Saving access token...");
      await TokenService.saveToken(accessToken);

      // Token'ın server'da aktif olması için küçük bir delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log("Fetching user profile...");

      try {
        // The repository should call another repository or have its own logic,
        // but not a use case.
        const registeredUser = await this.userRepository.getFromAuth();

        if (!registeredUser) {
          throw new Error(
            "Registration succeeded, but failed to fetch user profile."
          );
        }

        console.log("Registration completed successfully");
        return {
          accessToken,
          user: registeredUser,
        };
      } catch (fetchError: any) {
        console.warn(
          "Failed to fetch user profile after registration:",
          fetchError
        );

        // Fallback: Create user object from register data
        const fallbackUser: User = {
          id: "", // Will be populated when user is actually fetched
          email: user.email,
          userName: user.userName,
          firstName: user.firstName,
          lastName: user.lastName,
          dateOfBirth: user.dateOfBirth,
          createdDate: new Date(),
          followers: 0,
          following: 0,
        };

        console.log("Using fallback user data");
        return {
          accessToken,
          user: fallbackUser,
        };
      }
    } catch (error: any) {
      console.error("AuthRepositoryImpl: Register failed", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      // Backend'den gelen spesifik hataları handle et
      if (error.response?.status === 500) {
        const errorData = error.response.data;

        if (errorData?.detail === "AcceptLocales") {
          throw new Error(
            "Bu email adresi zaten kullanılıyor veya sunucu konfigürasyon hatası var. Lütfen farklı bir email deneyin."
          );
        }

        if (errorData?.stackTrace?.includes("UserEmailShouldBeNotExists")) {
          throw new Error(
            "Bu email adresi zaten kayıtlı. Lütfen farklı bir email adresi kullanın."
          );
        }
      }

      throw error;
    }
  }

  // Other methods from IAuthRepository need to be implemented here
  // For now, they can be stubs.
  async enableEmailAuthenticator(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  async enableOtpAuthenticator(): Promise<{
    secretKey: string;
    qrCodeUrl: string;
  }> {
    throw new Error("Method not implemented.");
  }

  async verifyEmailAuthenticator(
    userId: string,
    activationKey: string
  ): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  async verifyOtpAuthenticator(authenticatorCode: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  async sendEmailValidation(email: string): Promise<{
    isSuccess: boolean;
    message: string;
    expireDate?: Date;
  }> {
    const response = await this.authApi.sendEmailValidation({ email });
    return {
      isSuccess: response.isSuccess,
      message: response.message,
      expireDate: response.expireDate,
    };
  }

  async sendPasswordResetCode(email: string): Promise<{
    isSuccess: boolean;
    message: string;
  }> {
    const response = await this.authApi.sendPasswordResetCode({ email });
    return response;
  }

  async verifyCode(
    code: string,
    email: string
  ): Promise<{
    isSuccess: boolean;
    message: string;
  }> {
    const response = await this.authApi.verifyCode({ code, email });
    return response;
  }

  async verifyEmailCode(
    email: string,
    code: string,
    validationType: ValidationPurpose
  ): Promise<{
    isVerified: boolean;
    isSuccess: boolean;
    message: string;
  }> {
    console.log("AuthRepositoryImpl: Verifying email code...", {
      email,
      code: code.substring(0, 2) + "****",
      validationType,
    });

    const response = await this.authApi.verifyCode({
      email,
      code,
      validationType,
    });

    return {
      isVerified: response.isSuccess,
      isSuccess: response.isSuccess,
      message: response.message,
    };
  }

  async resetPassword(
    email: string,
    code: string,
    password: string
  ): Promise<{
    isSuccess: boolean;
    message: string;
  }> {
    const response = await this.authApi.resetPassword({
      email,
      code,
      password,
    });
    return response;
  }

  async revokeToken(): Promise<void> {
    try {
      await this.authApi.revokeToken();
    } catch (error) {
      console.error("Token revocation failed:", error);
      throw error;
    }
  }
}
