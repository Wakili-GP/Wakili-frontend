/**
 * Authentication Service
 * Handles login, registration, password reset, and OAuth
 */

import { httpClient, type ApiResponse } from "./api/httpClient";

// ============ Types ============

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  userType: "client" | "lawyer";
  profileImage?: string;
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
  rememberMe?: boolean;
}

export interface LoginResponse extends AuthTokens {
  user: AuthUser;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  userType: "client" | "lawyer";
  phoneNumber?: string;
  acceptTerms: boolean;
}

export interface RegisterResponse extends AuthTokens {
  user: AuthUser;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
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

// ============ Service ============

export const authService = {
  /**
   * Login with email and password
   * POST /auth/login
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    // Development fake credentials for testing
    if (
      credentials.email === "usama@email.com" &&
      credentials.password === "usama"
    ) {
      const fakeResponse: ApiResponse<LoginResponse> = {
        success: true,
        data: {
          accessToken: "fake-dev-token-12345",
          refreshToken: "fake-refresh-token-12345",
          expiresIn: 3600,
          user: {
            id: "dev-user-1",
            email: "usama@email.com",
            firstName: "Usama",
            lastName: "Developer",
            userType: "client",
            isEmailVerified: true,
            createdAt: new Date().toISOString(),
          },
        },
      };

      // Store fake token
      if (fakeResponse.data) {
        httpClient.setToken(fakeResponse.data.accessToken);
        localStorage.setItem("authToken", fakeResponse.data.accessToken);
        if (fakeResponse.data.refreshToken) {
          localStorage.setItem("refreshToken", fakeResponse.data.refreshToken);
        }
      }

      return fakeResponse;
    }

    const response = await httpClient.post<LoginResponse>(
      "/auth/login",
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
   * POST /auth/register
   */
  async register(
    data: RegisterRequest,
  ): Promise<ApiResponse<RegisterResponse>> {
    const response = await httpClient.post<RegisterResponse>(
      "/auth/register",
      data,
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
   * Logout user
   * POST /auth/logout
   */
  async logout(): Promise<ApiResponse<{ message: string }>> {
    const response = await httpClient.post<{ message: string }>("/auth/logout");

    // Clear local storage
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    httpClient.setToken(null);

    return response;
  },

  /**
   * Send password reset code to email
   * POST /auth/forgot-password
   */
  async forgotPassword(
    data: ForgotPasswordRequest,
  ): Promise<ApiResponse<{ message: string }>> {
    return httpClient.post<{ message: string }>("/auth/forgot-password", data);
  },

  /**
   * Reset password with verification code
   * POST /auth/reset-password
   */
  async resetPassword(
    data: ResetPasswordRequest,
  ): Promise<ApiResponse<{ message: string }>> {
    return httpClient.post<{ message: string }>("/auth/reset-password", data);
  },

  /**
   * Verify email with code
   * POST /auth/verify-email
   */
  async verifyEmail(
    data: VerifyEmailRequest,
  ): Promise<ApiResponse<{ message: string; user: AuthUser }>> {
    return httpClient.post<{ message: string; user: AuthUser }>(
      "/auth/verify-email",
      data,
    );
  },

  /**
   * Resend verification email
   * POST /auth/resend-verification
   */
  async resendVerificationEmail(
    email: string,
  ): Promise<ApiResponse<{ message: string }>> {
    return httpClient.post<{ message: string }>("/auth/resend-verification", {
      email,
    });
  },

  /**
   * Google OAuth login/register
   * POST /auth/google
   */
  async googleAuth(
    data: GoogleAuthRequest,
  ): Promise<ApiResponse<LoginResponse>> {
    const response = await httpClient.post<LoginResponse>("/auth/google", data);

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
   * GET /auth/me
   */
  async getCurrentUser(): Promise<ApiResponse<AuthUser>> {
    // Check if using fake dev token
    const token = localStorage.getItem("authToken");
    if (token === "fake-dev-token-12345") {
      return {
        success: true,
        data: {
          id: "dev-user-1",
          email: "usama@email.com",
          firstName: "Usama",
          lastName: "Developer",
          userType: "client",
          isEmailVerified: true,
          createdAt: new Date().toISOString(),
        },
      };
    }

    return httpClient.get<AuthUser>("/auth/me");
  },

  /**
   * Refresh access token
   * POST /auth/refresh
   */
  async refreshToken(refreshToken: string): Promise<ApiResponse<AuthTokens>> {
    const response = await httpClient.post<AuthTokens>("/auth/refresh", {
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
   * POST /auth/check-email
   */
  async checkEmailExists(
    email: string,
  ): Promise<ApiResponse<{ exists: boolean }>> {
    return httpClient.post<{ exists: boolean }>("/auth/check-email", { email });
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
