import axios, { AxiosError, type AxiosRequestConfig } from "axios";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

const baseURL =
  import.meta.env.MODE === "development"
    ? "/api"
    : import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

export const setHttpClientToken = (token: string | null): void => {
  if (token) {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common.Authorization;
  }
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("authToken") || localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

const normalizeSuccess = <T>(raw: unknown, status: number): ApiResponse<T> => {
  const payload = raw as { data?: T } | T;
  return {
    success: true,
    data:
      payload && typeof payload === "object" && "data" in payload
        ? (payload as { data?: T }).data
        : (payload as T),
    statusCode: status,
  };
};

const normalizeError = <T>(error: unknown): ApiResponse<T> => {
  if (error instanceof AxiosError) {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("adminToken");
      setHttpClientToken(null);
    }

    const responseData = error.response?.data as
      | { message?: string; error?: string }
      | undefined;

    return {
      success: false,
      error:
        responseData?.message ||
        responseData?.error ||
        error.message ||
        "An unexpected error occurred",
      statusCode: error.response?.status ?? 0,
      data: error.response?.data as T,
    };
  }

  return {
    success: false,
    error:
      error instanceof Error ? error.message : "An unexpected error occurred",
    statusCode: 0,
  };
};

const request = async <T>(
  method: "get" | "delete" | "post" | "put" | "patch",
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<ApiResponse<T>> => {
  try {
    const response =
      method === "get" || method === "delete"
        ? await axiosInstance[method](url, config)
        : await axiosInstance[method](url, data, config);

    return normalizeSuccess<T>(response.data, response.status);
  } catch (error) {
    return normalizeError<T>(error);
  }
};

export const httpClient = {
  setToken: setHttpClientToken,
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    request<T>("get", url, undefined, config),
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    request<T>("delete", url, undefined, config),
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    request<T>("post", url, data, config),
  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    request<T>("put", url, data, config),
  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    request<T>("patch", url, data, config),
};

export default httpClient;
