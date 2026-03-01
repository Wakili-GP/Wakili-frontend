import { httpClient, type ApiResponse } from "./api/httpClient";

// Types
export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  userType: "client" | "lawyer";
  profileImage?: string | null;
  isEmailVerified?: boolean;
  createdAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse extends AuthTokens {
  user: AuthUser;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  acceptTerms: boolean;
  password: string;
  userType: "client" | "lawyer";
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export const authService = {
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await httpClient.post<LoginResponse>(
      "/Auth/login",
      credentials,
    );
    if (response.success && response.data?.accessToken) {
      httpClient.setToken(response.data.accessToken);
      localStorage.setItem("authToken", response.data.accessToken);
      if (response.data?.refreshToken) {
        localStorage.setItem("refreshToken", response.data.refreshToken);
      }
    }
    return response;
  },

  async register(credentials: RegisterRequest): Promise<ApiResponse<void>> {
    const response = await httpClient.post<void>("/Auth/register", credentials);
    return response;
  },

  async forgotPassword(
    credentials: ForgotPasswordRequest,
  ): Promise<ApiResponse<{ message: string }>> {
    return httpClient.post<{ message: string }>(
      "/Auth/forget-password",
      credentials,
    );
  },

  async resetPassword(
    credentials: ResetPasswordRequest,
  ): Promise<ApiResponse<{ message: string }>> {
    return httpClient.post<{ message: string }>(
      "/Auth/reset-password",
      credentials,
    );
  },

  async verifyEmail(
    credentials: VerifyEmailRequest,
  ): Promise<ApiResponse<{ message: string }>> {
    return httpClient.post<{ message: string }>(
      "/Auth/veryify-email",
      credentials,
    );
  },

  async resendVerificationEmail(email: string): Promise<ApiResponse<void>> {
    return httpClient.post<void>("/Auth/resend-verification", email);
  },

  async getCurrentUser(): Promise<ApiResponse<AuthUser>> {
    return httpClient.get<AuthUser>("/Auth/me");
  },

  initializeToken(): void {
    const token = localStorage.getItem("authToken");
    if (token) {
      httpClient.setToken(token);
    }
  },
};

export default authService;
