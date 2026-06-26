import httpClient, { type ApiResponse } from "./api/httpClient";
import type {
  ForumPost,
  ForumComment,
  ForumSearchParams,
  ForumPostSubmission,
  ForumPostsResponse,
  ForumStats,
  ReactionType,
} from "@/types/forum.types";

import { MOCK_FORUM_POSTS, MOCK_FORUM_COMMENTS } from "@/data/mock-forum";

export const forumService = {
  async getPosts(
    params: ForumSearchParams = {},
  ): Promise<ApiResponse<ForumPostsResponse>> {
    try {
      const response = await httpClient.get<ApiResponse<ForumPostsResponse>>(
        "/forum/posts",
        { params },
      );
      return response.data;
    } catch {
      // Fallback to mock data
      let filtered = [...MOCK_FORUM_POSTS];
      
      // We only show approved posts in lists by default, unless status is provided
      if (params.status) {
        filtered = filtered.filter(p => p.status === params.status);
      } else {
        filtered = filtered.filter(p => p.status === "approved");
      }

      if (params.keyword) {
        const kw = params.keyword.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.title.toLowerCase().includes(kw) ||
            p.body.toLowerCase().includes(kw) ||
            p.tags.some((t) => t.toLowerCase().includes(kw)),
        );
      }

      if (params.category) {
        filtered = filtered.filter((p) => p.category.slug === params.category);
      }

      if (params.sortBy === "most_liked") {
        filtered.sort((a, b) => b.likesCount - a.likesCount);
      } else if (params.sortBy === "most_commented") {
        filtered.sort((a, b) => b.commentsCount - a.commentsCount);
      } else if (params.sortBy === "unanswered") {
        filtered = filtered.filter((p) => p.commentsCount === 0);
        filtered.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      } else {
        // default: newest
        filtered.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      }

      const page = params.page || 1;
      const limit = params.limit || 9;
      const start = (page - 1) * limit;
      const paged = filtered.slice(start, start + limit);

      return {
        success: true,
        data: {
          posts: paged,
          total: filtered.length,
          page,
          totalPages: Math.ceil(filtered.length / limit),
        },
        statusCode: 200,
      };
    }
  },

  async getPostById(id: string): Promise<ApiResponse<ForumPost>> {
    try {
      const response = await httpClient.get<ApiResponse<ForumPost>>(`/forum/posts/${id}`);
      return response.data;
    } catch {
      const post = MOCK_FORUM_POSTS.find((p) => p.id === id);
      if (post) {
        return { success: true, data: post, statusCode: 200 };
      }
      return { success: false, error: "Post not found", statusCode: 404 };
    }
  },

  async getLatestPosts(limit = 6): Promise<ApiResponse<ForumPost[]>> {
    try {
      const response = await httpClient.get<ApiResponse<ForumPost[]>>("/forum/posts/latest", {
        params: { limit },
      });
      return response.data;
    } catch {
      const sorted = [...MOCK_FORUM_POSTS]
        .filter((p) => p.status === "approved")
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);
      return { success: true, data: sorted, statusCode: 200 };
    }
  },

  async getForumStats(): Promise<ApiResponse<ForumStats>> {
    try {
      const response = await httpClient.get<ApiResponse<ForumStats>>("/forum/stats");
      return response.data;
    } catch {
      return {
        success: true,
        data: {
          totalQuestions: MOCK_FORUM_POSTS.length * 150,
          totalAnswers: Object.values(MOCK_FORUM_COMMENTS).flat().length * 200,
          activeUsers: 1250,
          resolvedQuestions: MOCK_FORUM_POSTS.filter(p => p.commentsCount > 0).length * 100,
        },
        statusCode: 200,
      };
    }
  },

  async createPost(data: ForumPostSubmission): Promise<ApiResponse<ForumPost>> {
    try {
      const response = await httpClient.post<ApiResponse<ForumPost>>("/forum/posts", data);
      return response.data;
    } catch {
      // Mock creation - return as pending
      const newPost: ForumPost = {
        id: crypto.randomUUID(),
        title: data.title,
        body: data.body,
        category: { id: data.categoryId, name: "mock", nameAr: "mock", slug: "mock", color: "#ccc" }, // Mock category for now
        author: { id: "u1", firstName: "مستخدم", lastName: "جديد", profileImage: null, userType: "Client" },
        status: "pending",
        tags: data.tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likesCount: 0,
        commentsCount: 0,
        viewsCount: 0,
        isLiked: false,
        isBookmarked: false,
      };
      return { success: true, data: newPost, statusCode: 201 };
    }
  },

  async getComments(postId: string): Promise<ApiResponse<ForumComment[]>> {
    try {
      const response = await httpClient.get<ApiResponse<ForumComment[]>>(`/forum/posts/${postId}/comments`);
      return response.data;
    } catch {
      const comments = MOCK_FORUM_COMMENTS[postId] || [];
      return { success: true, data: comments, statusCode: 200 };
    }
  },

  async createComment(
    postId: string,
    body: string,
    parentId?: string
  ): Promise<ApiResponse<ForumComment>> {
    try {
      const response = await httpClient.post<ApiResponse<ForumComment>>(`/forum/posts/${postId}/comments`, {
        body,
        parentId,
      });
      return response.data;
    } catch {
      const newComment: ForumComment = {
        id: crypto.randomUUID(),
        postId,
        parentId: parentId || null,
        body,
        author: { id: "u1", firstName: "مستخدم", lastName: "جديد", profileImage: null, userType: "Client" },
        createdAt: new Date().toISOString(),
        reactions: { like: 0, helpful: 0, insightful: 0 },
        userReaction: null,
        replies: [],
      };
      return { success: true, data: newComment, statusCode: 201 };
    }
  },

  async reactToPost(
    postId: string,
    reaction: ReactionType
  ): Promise<ApiResponse<{ likesCount: number; isLiked: boolean }>> {
    try {
      const response = await httpClient.post<ApiResponse<{ likesCount: number; isLiked: boolean }>>(
        `/forum/posts/${postId}/react`,
        { reaction }
      );
      return response.data;
    } catch {
      return { success: true, data: { likesCount: 43, isLiked: true }, statusCode: 200 };
    }
  },

  async reactToComment(
    commentId: string,
    reaction: ReactionType
  ): Promise<ApiResponse<{ reactions: { like: number; helpful: number; insightful: number }; userReaction: ReactionType }>> {
    try {
      const response = await httpClient.post<
        ApiResponse<{ reactions: { like: number; helpful: number; insightful: number }; userReaction: ReactionType }>
      >(`/forum/comments/${commentId}/react`, { reaction });
      return response.data;
    } catch {
      return {
        success: true,
        data: {
          reactions: { like: 15, helpful: 30, insightful: 5 },
          userReaction: reaction,
        },
        statusCode: 200,
      };
    }
  },
};
