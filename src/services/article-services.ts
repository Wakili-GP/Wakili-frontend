import httpClient, { type ApiResponse } from "./api/httpClient";
import type {
  Article,
  ArticlesResponse,
  ArticleSearchParams,
  ArticleSubmission,
  ArticleStats,
  VoteType,
} from "@/types/article.types";

// ── Mock Data for development ──
import { MOCK_ARTICLES } from "@/data/mock-articles";

export const articleService = {
  // ── Public Endpoints ──

  async getArticles(
    params: ArticleSearchParams = {},
  ): Promise<ApiResponse<ArticlesResponse>> {
    try {
      const response = await httpClient.get<ApiResponse<ArticlesResponse>>(
        "/articles",
        { params },
      );
      return response.data;
    } catch {
      // Fallback to mock data during development
      const filtered = filterMockArticles(params);
      const page = params.page || 1;
      const limit = params.limit || 9;
      const start = (page - 1) * limit;
      const paged = filtered.slice(start, start + limit);

      return {
        success: true,
        data: {
          articles: paged,
          total: filtered.length,
          page,
          totalPages: Math.ceil(filtered.length / limit),
        },
        statusCode: 200,
      };
    }
  },

  async getArticleById(id: string): Promise<ApiResponse<Article>> {
    try {
      const response = await httpClient.get<ApiResponse<Article>>(
        `/articles/${id}`,
      );
      return response.data;
    } catch {
      const article = MOCK_ARTICLES.find((a) => a.id === id);
      if (article) {
        return { success: true, data: article, statusCode: 200 };
      }
      return {
        success: false,
        error: "Article not found",
        statusCode: 404,
      };
    }
  },

  async getLatestArticles(limit = 3): Promise<ApiResponse<Article[]>> {
    try {
      const response = await httpClient.get<ApiResponse<Article[]>>(
        "/articles/latest",
        { params: { limit } },
      );
      return response.data;
    } catch {
      const sorted = [...MOCK_ARTICLES]
        .filter((a) => a.status === "published")
        .sort(
          (a, b) =>
            new Date(b.publishedAt || b.createdAt).getTime() -
            new Date(a.publishedAt || a.createdAt).getTime(),
        )
        .slice(0, limit);
      return { success: true, data: sorted, statusCode: 200 };
    }
  },

  async getArticleStats(): Promise<ApiResponse<ArticleStats>> {
    try {
      const response =
        await httpClient.get<ApiResponse<ArticleStats>>("/articles/stats");
      return response.data;
    } catch {
      const published = MOCK_ARTICLES.filter((a) => a.status === "published");
      return {
        success: true,
        data: {
          totalArticles: published.length,
          totalUpvotes: published.reduce((s, a) => s + a.upvotes, 0),
          totalReads: published.reduce((s, a) => s + a.totalReads, 0),
          totalReadTimeGenerated: published.reduce(
            (s, a) => s + a.readTimeMinutes * a.totalReads,
            0,
          ),
        },
        statusCode: 200,
      };
    }
  },

  async getRelatedArticles(
    articleId: string,
    limit = 3,
  ): Promise<ApiResponse<Article[]>> {
    try {
      const response = await httpClient.get<ApiResponse<Article[]>>(
        `/articles/${articleId}/related`,
        { params: { limit } },
      );
      return response.data;
    } catch {
      const article = MOCK_ARTICLES.find((a) => a.id === articleId);
      const related = MOCK_ARTICLES.filter(
        (a) =>
          a.id !== articleId &&
          a.status === "published" &&
          (a.category.id === article?.category.id ||
            a.author.id === article?.author.id),
      ).slice(0, limit);
      return { success: true, data: related, statusCode: 200 };
    }
  },

  // ── Voting ──

  async voteArticle(
    articleId: string,
    vote: VoteType,
  ): Promise<ApiResponse<{ upvotes: number; downvotes: number; userVote: VoteType }>> {
    try {
      const response = await httpClient.post<
        ApiResponse<{ upvotes: number; downvotes: number; userVote: VoteType }>
      >(`/articles/${articleId}/vote`, { vote });
      return response.data;
    } catch {
      return {
        success: true,
        data: { upvotes: 143, downvotes: 8, userVote: vote },
        statusCode: 200,
      };
    }
  },

  // ── Lawyer Dashboard Endpoints ──

  async getMyArticles(): Promise<ApiResponse<Article[]>> {
    try {
      const response =
        await httpClient.get<ApiResponse<Article[]>>("/articles/my");
      return response.data;
    } catch {
      return { success: true, data: MOCK_ARTICLES, statusCode: 200 };
    }
  },

  async getMyArticleStats(): Promise<ApiResponse<ArticleStats>> {
    try {
      const response = await httpClient.get<ApiResponse<ArticleStats>>(
        "/articles/my/stats",
      );
      return response.data;
    } catch {
      return {
        success: true,
        data: {
          totalArticles: MOCK_ARTICLES.length,
          totalUpvotes: MOCK_ARTICLES.reduce((s, a) => s + a.upvotes, 0),
          totalReads: MOCK_ARTICLES.reduce((s, a) => s + a.totalReads, 0),
          totalReadTimeGenerated: MOCK_ARTICLES.reduce(
            (s, a) => s + a.readTimeMinutes * a.totalReads,
            0,
          ),
        },
        statusCode: 200,
      };
    }
  },

  async createArticle(
    data: ArticleSubmission,
  ): Promise<ApiResponse<Article>> {
    try {
      const response = await httpClient.post<ApiResponse<Article>>(
        "/articles",
        data,
      );
      return response.data;
    } catch {
      return {
        success: true,
        data: { ...MOCK_ARTICLES[0], ...data, id: crypto.randomUUID() },
        statusCode: 201,
      };
    }
  },

  async updateArticle(
    id: string,
    data: Partial<ArticleSubmission>,
  ): Promise<ApiResponse<Article>> {
    try {
      const response = await httpClient.put<ApiResponse<Article>>(
        `/articles/${id}`,
        data,
      );
      return response.data;
    } catch {
      const existing = MOCK_ARTICLES.find((a) => a.id === id);
      return {
        success: true,
        data: { ...existing!, ...data },
        statusCode: 200,
      };
    }
  },

  async submitForReview(id: string): Promise<ApiResponse<Article>> {
    try {
      const response = await httpClient.post<ApiResponse<Article>>(
        `/articles/${id}/submit`,
      );
      return response.data;
    } catch {
      const existing = MOCK_ARTICLES.find((a) => a.id === id);
      return {
        success: true,
        data: { ...existing!, status: "under_review" },
        statusCode: 200,
      };
    }
  },

  async deleteArticle(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await httpClient.delete<ApiResponse<void>>(
        `/articles/${id}`,
      );
      return response.data;
    } catch {
      return { success: true, statusCode: 200 };
    }
  },
};

// ── Helper for mock filtering ──
function filterMockArticles(params: ArticleSearchParams): Article[] {
  let articles = MOCK_ARTICLES.filter((a) => a.status === "published");

  if (params.keyword) {
    const kw = params.keyword.toLowerCase();
    articles = articles.filter(
      (a) =>
        a.title.toLowerCase().includes(kw) ||
        a.excerpt.toLowerCase().includes(kw) ||
        a.tags.some((t) => t.toLowerCase().includes(kw)),
    );
  }

  if (params.category) {
    articles = articles.filter((a) => a.category.slug === params.category);
  }

  if (params.authorId) {
    articles = articles.filter((a) => a.author.id === params.authorId);
  }

  if (params.sortBy === "most_liked") {
    articles.sort((a, b) => b.upvotes - b.downvotes - (a.upvotes - a.downvotes));
  } else if (params.sortBy === "most_read") {
    articles.sort((a, b) => b.totalReads - a.totalReads);
  } else {
    articles.sort(
      (a, b) =>
        new Date(b.publishedAt || b.createdAt).getTime() -
        new Date(a.publishedAt || a.createdAt).getTime(),
    );
  }

  return articles;
}

export default articleService;
