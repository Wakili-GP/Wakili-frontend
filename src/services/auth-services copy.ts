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
  firtName: string;
  lastName: string;
  email: string;
  acceptTerms: boolean;
  password: string;
  userType: "client" | "lawyer";
}

// export interface RegisterResponse extends AuthTokens {
//   user: AuthUser;
// }

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

export interface GoogleAuthRequest {
  googleToken: string;
  userType: "client" | "lawyer";
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Service

export const authService = {
  /**
   * Login with email and password
   * POST /Auth/login
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await httpClient.post<LoginResponse>(
      "/Auth/login",
      credentials,
    );

    if (response.success && response.data?.accessToken) {
      httpClient.setToken(response.data.accessToken);
      localStorage.setItem("authToken", response.data.accessToken);
      if (response.data.refreshToken) {
        localStorage.setItem("refreshToken", response.data.refreshToken);
      }
    }

    return response;
  },

  /**
   * Register new user
   * POST /Auth/register
   */
  async register(data: RegisterRequest): Promise<ApiResponse<void>> {
    const response = await httpClient.post<void>("/Auth/register", data);
    return response;
  },

  /**
   * Send password reset code to email
   * POST /Auth/forget-password
   */
  async forgotPassword(
    data: ForgotPasswordRequest,
  ): Promise<ApiResponse<{ message: string }>> {
    return httpClient.post<{ message: string }>("/Auth/forget-password", data);
  },

  /**
   * Reset password with verification code
   * POST /Auth/reset-password
   */
  async resetPassword(
    data: ResetPasswordRequest,
  ): Promise<ApiResponse<{ message: string }>> {
    return httpClient.post<{ message: string }>("/Auth/reset-password", data);
  },

  /**
   * Verify email with code
   * POST /Auth/verify-email
   */
  async verifyEmail(
    data: VerifyEmailRequest,
  ): Promise<ApiResponse<{ message: string; user: AuthUser }>> {
    return httpClient.post<{ message: string; user: AuthUser }>(
      "/Auth/verify-email",
      data,
    );
  },

  /**
   * Resend verification email
   * POST /Auth/resend-verification
   */
  async resendVerificationEmail(
    email: string,
  ): Promise<ApiResponse<{ message: string }>> {
    return httpClient.post<{ message: string }>("/Auth/resend-verification", {
      email,
    });
  },

  /**
   * Google OAuth login/register
   * POST /Auth/google
   */
  async googleAuth(
    data: GoogleAuthRequest,
  ): Promise<ApiResponse<LoginResponse>> {
    const response = await httpClient.post<LoginResponse>("/Auth/google", data);

    if (response.success && response.data?.accessToken) {
      httpClient.setToken(response.data.accessToken);
      localStorage.setItem("authToken", response.data.accessToken);
      if (response.data.refreshToken) {
        localStorage.setItem("refreshToken", response.data.refreshToken);
      }
    }

    return response;
  },

  /**
   * Get current authenticated user
   * GET /Auth/me
   */
  async getCurrentUser(): Promise<ApiResponse<AuthUser>> {
    return httpClient.get<AuthUser>("/Auth/me");
  },

  /**
   * Refresh access token
   * POST /Auth/refresh
   */
  async refreshToken(refreshToken: string): Promise<ApiResponse<AuthTokens>> {
    const response = await httpClient.post<AuthTokens>("/Auth/refresh", {
      refreshToken,
    });

    if (response.success && response.data?.accessToken) {
      httpClient.setToken(response.data.accessToken);
      localStorage.setItem("authToken", response.data.accessToken);
    }

    return response;
  },

  /**
   * Check if email exists
   * POST /Auth/check-email
   */
  async checkEmailExists(
    email: string,
  ): Promise<ApiResponse<{ exists: boolean }>> {
    return httpClient.post<{ exists: boolean }>("/Auth/check-email", { email });
  },

  /**
   * Initialize token on app load
   */
  initializeToken(): void {
    const token = localStorage.getItem("authToken");
    if (token) {
      httpClient.setToken(token);
    }
  },
};

export default authService;
