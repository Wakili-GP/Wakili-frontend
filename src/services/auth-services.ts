import httpClient, {
  type ApiResponse,
  setHttpClientToken,
} from "./api/httpClient";

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: "Client" | "Lawyer";
  status:
    | "Active"
    | "Unfinished"
    | "SubmittedAndNotApproved"
    | "SubmittedAndApproved";
  city: string | null;
  country: string | null;
  phoneNumber: string | null;
  profileImage: string | null;
  isEmailVerified: boolean;
  createdAt: string;
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
  userType: "Client" | "Lawyer";
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
    const response = await httpClient.post("/auth/login", {
      email: credentials.email,
      password: credentials.password,
    });

    return response.data;
  },

  async register(credentials: RegisterRequest): Promise<ApiResponse<void>> {
    const response = (await httpClient.post(
      "/Auth/register",
      credentials,
    )) as unknown as ApiResponse<void>;
    return response;
  },

  async forgotPassword(
    credentials: ForgotPasswordRequest,
  ): Promise<ApiResponse<{ message: string }>> {
    return httpClient.post(
      "/Auth/forget-password",
      credentials,
    ) as unknown as Promise<ApiResponse<{ message: string }>>;
  },

  async resetPassword(
    credentials: ResetPasswordRequest,
  ): Promise<ApiResponse<{ message: string }>> {
    return httpClient.post(
      "/Auth/reset-password",
      credentials,
    ) as unknown as Promise<ApiResponse<{ message: string }>>;
  },

  async verifyEmail(
    credentials: VerifyEmailRequest,
  ): Promise<ApiResponse<{ message: string }>> {
    return httpClient.post(
      "/Auth/verify-email",
      credentials,
    ) as unknown as Promise<ApiResponse<{ message: string }>>;
  },

  async resendVerificationEmail(email: string): Promise<ApiResponse<void>> {
    return httpClient.post("/Auth/resend-verification", {
      email,
    }) as unknown as Promise<ApiResponse<void>>;
  },

  async getCurrentUser(): Promise<ApiResponse<AuthUser>> {
    const response = await httpClient.get<ApiResponse<AuthUser>>("/Auth/me");
    return response.data;
  },

  initializeToken(): void {
    const token = localStorage.getItem("authToken");
    if (token) {
      setHttpClientToken(token);
    }
  },
};

export default authService;
