import axios from "axios";

const BASE_URL = "https://nouraelkashif83--legal-ai-auditor-api.modal.run";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    accept: "application/json",
  },
});

export type RiskLevel = "low" | "medium" | "high";

export interface Risk {
  level: RiskLevel;
  description: string;
  reference: string;
}

export interface AnalysisResult {
  contract_type: string;
  summary: string;
  risks: Risk[];
  obligations: Record<string, string[]>;
  comparison_table: string[][];
}

export interface AnalysisResponse {
  analysis_id: string;
  filename: string;
  analysis: AnalysisResult;
  status: string;
}

export type HistoryEntry = ["human" | "ai", string];

export interface AnalyzePayload {
  file: File;
  history?: HistoryEntry[];
}

export interface ChatPayload {
  analysis_id: string;
  query: string;
  history?: HistoryEntry[];
}

export interface ChatResponse {
  answer: string;
  status: string;
  history: HistoryEntry[];
}

export interface ApiStatus {
  status: "online" | "offline";
  active_sessions: number;
}

export const analyzeContractService = {
  analyzeContract: async ({
    file,
    history = [],
  }: AnalyzePayload): Promise<AnalysisResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("history", JSON.stringify(history));

    const { data } = await apiClient.post<AnalysisResponse>(
      "/analyze",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return data;
  },
  chatWithContract: async ({
    analysis_id,
    query,
    history = [],
  }: ChatPayload): Promise<ChatResponse> => {
    const { data } = await apiClient.post<ChatResponse>("/chat", {
      analysis_id,
      query,
      history,
    });
    return data;
  },
  getApiStatus: async (): Promise<ApiStatus> => {
    const { data } = await apiClient.get<ApiStatus>("/status");
    return data;
  },
};

export default analyzeContractService;
