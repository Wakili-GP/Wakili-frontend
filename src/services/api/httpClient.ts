/**
 * Central HTTP Client for API communication
 * Handles base URL, error handling, and token management
 */

type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestConfig {
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string | number | boolean>;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode?: number;
}

class HttpClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  constructor(baseURL: string = "http://localhost:3000/api") {
    this.baseURL = baseURL;
  }

  /**
   * Set Bearer token for authenticated requests
   */
  setToken(token: string | null): void {
    if (token) {
      this.defaultHeaders["Authorization"] = `Bearer ${token}`;
    } else {
      delete this.defaultHeaders["Authorization"];
    }
  }

  /**
   * Get stored token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem("authToken");
  }

  /**
   * Build query string from params object
   */
  private buildQueryString(
    params?: Record<string, string | number | boolean>,
  ): string {
    if (!params || Object.keys(params).length === 0) {
      return "";
    }
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    return `?${searchParams.toString()}`;
  }

  /**
   * Make HTTP request
   */
  private async request<T>(
    method: RequestMethod,
    endpoint: string,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}${this.buildQueryString(config?.params)}`;

    const headers = {
      ...this.defaultHeaders,
      ...config?.headers,
    };

    // Auto-include token if available
    const token = this.getToken();
    if (token && !headers["Authorization"]) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: config?.body ? JSON.stringify(config.body) : undefined,
      });

      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        const errorMessage =
          typeof data === "string" ? data : this.formatErrorMessage(data);
        return {
          success: false,
          error: errorMessage,
          statusCode: response.status,
          data,
        };
      }

      const backendSuccess =
        typeof data === "object" && data !== null && "success" in data
          ? Boolean((data as { success?: unknown }).success)
          : true;

      if (!backendSuccess) {
        const errorMessage =
          typeof data === "string" ? data : this.formatErrorMessage(data);
        return {
          success: false,
          error: errorMessage,
          statusCode: response.status,
          data,
        };
      }

      return {
        success: true,
        data: typeof data === "string" ? (data as T) : data.data || data,
        statusCode: response.status,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Network error occurred";
      return {
        success: false,
        error: errorMessage,
        statusCode: 0,
      };
    }
  }

  private formatErrorMessage(data: unknown): string {
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
  }

  /**
   * GET request
   */
  async get<T = unknown>(
    endpoint: string,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>("GET", endpoint, config);
  }

  /**
   * POST request
   */
  async post<T = unknown>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>("POST", endpoint, {
      ...config,
      body,
    });
  }

  /**
   * PUT request
   */
  async put<T = unknown>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>("PUT", endpoint, {
      ...config,
      body,
    });
  }

  /**
   * PATCH request
   */
  async patch<T = unknown>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>("PATCH", endpoint, {
      ...config,
      body,
    });
  }

  /**
   * DELETE request
   */
  async delete<T = unknown>(
    endpoint: string,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>("DELETE", endpoint, config);
  }
}

// Export singleton instance
export const httpClient = new HttpClient(
  import.meta.env.MODE === "development"
    ? "/api"
    : import.meta.env.VITE_API_BASE_URL,
);

export default httpClient;
export type { ApiResponse, RequestConfig };
