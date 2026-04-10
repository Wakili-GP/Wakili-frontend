import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { authService, type AuthUser } from "@/services/auth-services";
import { setHttpClientToken } from "@/services/api/httpClient";

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  isLoading: boolean;
  initializeAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export type AuthContextType = Omit<AuthState, "initializeAuth">;

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true,
  initializeAuth: async () => {
    authService.initializeToken();

    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const response = await authService.getCurrentUser();
        if (response.success && response.data) {
          set({ user: response.data, isAuthenticated: true });
        } else {
          // Token invalid, clear it.
          localStorage.removeItem("authToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("userId");
          setHttpClientToken(null);
          set({ user: null, isAuthenticated: false });
        }
      } catch {
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userId");
        setHttpClientToken(null);
        set({ user: null, isAuthenticated: false });
      }
    }

    set({ isLoading: false });
  },
  login: async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    if (response.success && response.data) {
      localStorage.setItem("authToken", response.data.accessToken);
      if (response.data.refreshToken) {
        localStorage.setItem("refreshToken", response.data.refreshToken);
      }
      localStorage.setItem("userId", response.data.user.id);
      setHttpClientToken(response.data.accessToken);
      set({ user: response.data.user, isAuthenticated: true });
      console.log("User", response.data.user);
    } else {
      console.error("Auth Store Login failed:", response.error);
      throw new Error(response.error || "Login failed");
    }
  },
  logout: async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    setHttpClientToken(null);

    set({ user: null, isAuthenticated: false });
  },
  refreshUser: async () => {
    const response = await authService.getCurrentUser();
    if (response.success && response.data) {
      set({ user: response.data, isAuthenticated: true });
    } else {
      set({ user: null, isAuthenticated: false });
    }
  },
}));

export const useAuth = (): AuthContextType =>
  useAuthStore(
    useShallow((state) => ({
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      isLoading: state.isLoading,
      login: state.login,
      logout: state.logout,
      refreshUser: state.refreshUser,
    })),
  );
