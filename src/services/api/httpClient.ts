/**
 * HTTP Client using Axios
 * Handles API requests with automatic error handling and token management
 */

import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosError, type AxiosResponse } from "axios";

// ============ Types ============

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode?: number;
}

interface RequestConfig extends AxiosRequestConfig {
  params?: Record<string, string | number | boolean>;
}

// ============ Helper Functions ============

const formatErrorMessage = (data: unknown): string => {
  if (typeof data === "string") {
    return data;
  }

  if (!data || typeof data !== "object") {
    return "Request failed";
  }

  const errorObject = data as {
    error?: string;
    message?: string;
    title?: string;
    errors?: Record<string, string[]>;
  };

  if (errorObject.error) {
    return errorObject.error;
  }

  if (errorObject.message) {
    return errorObject.message;
  }

  if (errorObject.errors && Object.keys(errorObject.errors).length > 0) {
    const firstKey = Object.keys(errorObject.errors)[0];
    const firstValue = errorObject.errors[firstKey]?.[0];
    if (firstValue) {
      return firstValue;
    }
  }

  return errorObject.title || "Request failed";
};

// ============ Axios Instance Setup ============

const baseURL =
  import.meta.env.MODE === "development"
    ? "/api"
    : import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ============ Interceptors ============

/**
 * Request Interceptor - Add Authorization token
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * Response Interceptor - Handle API success flag and errors
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Check if response has success flag and it's false
    const responseData = response.data as Record<string, unknown>;
    if (
      typeof responseData === "object" &&
      responseData !== null &&
      "success" in responseData
    ) {
      if (responseData.success === false) {
        // Treat as error even though HTTP 200
        const error = new Error(
          formatErrorMessage(response.data),
        ) as AxiosError;
        error.response = response;
        return Promise.reject(error);
      }
    }

    return response;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// ============ HTTP Client Class ============

class HttpClient {
  private axiosInstance: AxiosInstance;

  constructor(instance: AxiosInstance) {
    this.axiosInstance = instance;
  }

  /**
   * Set Bearer token for authenticated requests
   */
  setToken(token: string | null): void {
    if (token) {
      this.axiosInstance.defaults.headers.common["Authorization"] =
        `Bearer ${token}`;
    } else {
      delete this.axiosInstance.defaults.headers.common["Authorization"];
    }
  }

  /**
   * Get stored token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem("authToken");
  }

  /**
   * GET request
   */
  async get<T = unknown>(
    endpoint: string,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.get<unknown>(endpoint, config);
      const responseData = response.data as Record<string, unknown>;
      return {
        success: true,
        data: (responseData.data || responseData) as T,
        statusCode: response.status,
      };
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  /**
   * POST request
   */
  async post<T = unknown>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.post<unknown>(
        endpoint,
        body,
        config,
      );
      const responseData = response.data as Record<string, unknown>;
      return {
        success: true,
        data: (responseData.data || responseData) as T,
        statusCode: response.status,
      };
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  /**
   * PUT request
   */
  async put<T = unknown>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.put<unknown>(
        endpoint,
        body,
        config,
      );
      const responseData = response.data as Record<string, unknown>;
      return {
        success: true,
        data: (responseData.data || responseData) as T,
        statusCode: response.status,
      };
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  /**
   * PATCH request
   */
  async patch<T = unknown>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.patch<unknown>(
        endpoint,
        body,
        config,
      );
      const responseData = response.data as Record<string, unknown>;
      return {
        success: true,
        data: (responseData.data || responseData) as T,
        statusCode: response.status,
      };
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  /**
   * DELETE request
   */
  async delete<T = unknown>(
    endpoint: string,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.delete<unknown>(endpoint, config);
      const responseData = response.data as Record<string, unknown>;
      return {
        success: true,
        data: (responseData.data || responseData) as T,
        statusCode: response.status,
      };
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  /**
   * Handle errors from axios
   */
  private handleError<T>(error: unknown): ApiResponse<T> {
    if (axios.isAxiosError(error)) {
      const message = formatErrorMessage(
        error.response?.data || error.message,
      );
      return {
        success: false,
        error: message,
        statusCode: error.response?.status || 0,
        data: error.response?.data,
      };
    }

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
        statusCode: 0,
      };
    }

    return {
      success: false,
      error: "Network error occurred",
      statusCode: 0,
    };
  }
}

// ============ Export Singleton Instance ============

export const httpClient = new HttpClient(axiosInstance);

export { axiosInstance };
export default httpClient;
export type { RequestConfig };
