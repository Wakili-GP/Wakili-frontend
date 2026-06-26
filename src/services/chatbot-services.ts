import axios from "axios";
const BASE_URL =
  import.meta.env.MODE === "development"
    ? "/chatbot-api"
    : import.meta.env.VITE_CHATBOT_API_BASE_URL ||
      "https://mayarwaleedd12--wakili-api-fastapi-app.modal.run";

export const chatApiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: false,
  timeout: 30000,
});

chatApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Chatbot API error:", error);
    console.error("Chatbot API Error Response:", error.response?.data);
    return Promise.reject(error);
  },
);

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode: number;
}

export interface ChatMeta {
  session_id: string;
  title: string;
  last_message: string;
  updated_at: string; // ISO string
}

export interface AskPayload {
  eastern_arabic_numerals?: boolean;
  include_sources?: boolean;
  query: string;
  session_id: string;
  user_id: string;
}

export interface LegalSource {
  article_id: string;
  article_number: string;
  law_name: string;
  legal_nature: string;
  keywords: string;
  part: string;
  chapter: string;
  page_content: string;
}

export interface AskResponse {
  answer: string;
  session_id: string;
  sources: LegalSource[];
}

export interface LegalSource {
  part: string;
  chapter: string;
  keywords: string;
  law_name: string;
  article_id: string;
  legal_nature: string;
  page_content: string;
  article_number: string;
}
export interface HistoryMessage {
  role: "user" | "assistant";
  content: string;
  sources: LegalSource[];
}

export interface HistoryResponse {
  session_id: string;
  history: HistoryMessage[];
}

export const chatbotService = {
  // Get Session ID
  async getSessionId(): Promise<string> {
    const res = await chatApiClient.post("/session");
    console.log("Get Session ID Response.data:", res.data);
    return res.data.session_id || res.data.data || "";
  },
  async ask(payload: AskPayload): Promise<AskResponse> {
    const { data } = await chatApiClient.post<ApiResponse<AskResponse>>(
      "/ask",
      {
        include_sources: true,
        eastern_arabic_numerals: false,
        ...payload,
      },
    );
    if (!data.data) {
      throw new Error(data.error || "Failed to get an answer from the server");
    }
    return data.data;
  },
  // getChatHistory
  async getChatHistory(session_id: string): Promise<HistoryMessage[]> {
    console.log("Chat History session_id:", session_id);
    const res = await chatApiClient.get("/history", {
      params: { session_id },
    });
    console.log("Chat History Response.data:", res.data);
    return res.data.history || res.data.data?.history || [];
  },
  // Getting User's Chat History
  async getUserChatHistory(user_id: string): Promise<ChatMeta[]> {
    console.log("User Chat History user_id:", user_id);
    const res = await chatApiClient.get<ApiResponse<ChatMeta[]>>("/sessions", {
      params: { user_id },
    });
    console.log("User Chat History Response.data:", res.data);
    return res.data.data ?? [];
  },
  // Delete Chat by ID
  async deleteChat(session_id: string): Promise<void> {
    console.log("Delete Chat session_id:", session_id);
    await chatApiClient.delete(`/session/${session_id}`);
  },
  // Rename Chat By ID
  async renameChat(session_id: string, newTitle: string): Promise<void> {
    console.log("Rename Chat session_id:", session_id, "newTitle:", newTitle);
    await chatApiClient.put(`/session/${session_id}`, {
      new_title: newTitle,
    });
  },
  // Health
  async healthCheck(): Promise<boolean> {
    const res = await chatApiClient.get("/health");
    console.log("Health Check Response:", res.data);
    if (res.data.status === "ok") {
      return true;
    }
    return false;
  },
};

export interface LegalReference {
  article: string;
  law: string;
  description?: string;
}

export const mapSourceToReference = (source: LegalSource): LegalReference => {
  // Extract the simplified explanation from the end of page_content
  const simplifiedMatch = source.page_content.match(/الشرح المبسط:\s*(.+)$/);
  return {
    article: `المادة ${source.article_number}`,
    law: source.law_name,
    description: simplifiedMatch?.[1] ?? source.legal_nature,
  };
};

export default chatbotService;
