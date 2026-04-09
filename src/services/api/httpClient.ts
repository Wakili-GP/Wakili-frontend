import axios, { AxiosError } from "axios";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode: number;
}

const baseURL =
  import.meta.env.MODE === "development"
    ? "/api"
    : import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
const httpClient = axios.create({
  baseURL: baseURL,
  headers: {
    "x-lang": "ar",
  },
  timeout: 30000,
});

export const setHttpClientToken = (token: string | null) => {
  if (token) {
    httpClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete httpClient.defaults.headers.common["Authorization"];
  }
};

httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

httpClient.interceptors.response.use(
  (response) => {
    console.log("Axios API Response:", response);
    console.log("Axios Response Data:", response.data);
    return response;
  },
  (error) => {
    console.error("Axios API Error:", error);
    if (error.response?.status === 401) {
      console.log("Unauthorized");
    }

    return Promise.reject(error);
  },
);

export default httpClient;
