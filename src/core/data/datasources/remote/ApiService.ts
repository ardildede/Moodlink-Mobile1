import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { TokenService } from "@/common/services/TokenService";
import config from "@/common/config";

// Event system for logout and toast
let logoutCallback: (() => Promise<void>) | null = null;
let showToastCallback:
  | ((message: string, type: "error" | "success" | "warning" | "info") => void)
  | null = null;

export const setLogoutCallback = (callback: () => Promise<void>) => {
  logoutCallback = callback;
};

export const setToastCallback = (
  callback: (
    message: string,
    type: "error" | "success" | "warning" | "info"
  ) => void
) => {
  showToastCallback = callback;
};

export const ApiService: AxiosInstance = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept-Language": "tr-TR,tr;q=0.9,en;q=0.8",
    Accept: "application/json",
  },
});

// Request Interceptor: Add Authorization header and log the request
ApiService.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    console.log(
      `[API Request] ==> ${config.method?.toUpperCase()} ${config.baseURL}${
        config.url
      }`
    );
    const token = await TokenService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 errors and log responses/errors
ApiService.interceptors.response.use(
  (response) => {
    console.log(
      `[API Response] <== ${
        response.status
      } ${response.config.method?.toUpperCase()} ${response.config.url}`
    );
    return response;
  },
  async (error) => {
    // Log the error
    if (error.response) {
      console.error(
        `[API Error] <== ${
          error.response.status
        } ${error.config.method?.toUpperCase()} ${error.config.url}`,
        error.response.data
      );
    } else if (error.request) {
      console.error("[API Error] No response received:", error.request);
    } else {
      console.error("[API Error] Error setting up request:", error.message);
    }

    // Check if the error is 401
    if (error.response?.status === 401) {
      console.error(
        "Authentication Error: Token is invalid or expired. Logging out."
      );

      // Show toast message for session expiry
      if (showToastCallback) {
        showToastCallback(
          "Oturumunuzun süresi dolmuştur. Lütfen tekrar giriş yapın.",
          "warning"
        );
      }

      // Use the logout callback if it's set
      if (logoutCallback) {
        try {
          await logoutCallback();
        } catch (logoutError) {
          console.error("Logout callback failed:", logoutError);
        }
      }

      // Don't retry, just reject with a clear message
      return Promise.reject(
        new Error("Oturumunuzun süresi dolmuştur. Lütfen tekrar giriş yapın.")
      );
    }

    return Promise.reject(error);
  }
);

export default ApiService;
