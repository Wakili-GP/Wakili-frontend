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

export const forumService = {
  async getPosts(
    params: ForumSearchParams = {},
  ): Promise<ApiResponse<ForumPostsResponse>> {
    const response = await httpClient.get<ApiResponse<ForumPostsResponse>>(
      "/Forums/posts",
      { params },
    );
    return response.data;
  },

  async getPostById(id: string): Promise<ApiResponse<ForumPost>> {
    const response = await httpClient.get<ApiResponse<ForumPost>>(`/Forums/posts/${id}`);
    return response.data;
  },

  async getLatestPosts(limit = 6): Promise<ApiResponse<ForumPost[]>> {
    const response = await httpClient.get<ApiResponse<ForumPost[]>>("/Forums/posts/latest", {
      params: { limit },
    });
    return response.data;
  },

  async getForumStats(): Promise<ApiResponse<ForumStats>> {
    const response = await httpClient.get<ApiResponse<ForumStats>>("/Forums/stats");
    return response.data;
  },

  async createPost(data: ForumPostSubmission): Promise<ApiResponse<ForumPost>> {
    const payload = {
      ...data
    };
    const response = await httpClient.post<ApiResponse<ForumPost>>("/Forums/posts", payload);
    return response.data;
  },

  async getComments(postId: string): Promise<ApiResponse<ForumComment[]>> {
    const response = await httpClient.get<ApiResponse<ForumComment[]>>(`/Forums/posts/${postId}/comments`);
    return response.data;
  },

  async createComment(
    postId: string,
    body: string,
    parentId?: string
  ): Promise<ApiResponse<ForumComment>> {
    const payload = {
      body,
      parentId,
      postId,
      authorId: "u1"
    };
    const response = await httpClient.post<ApiResponse<ForumComment>>(`/Forums/posts/${postId}/comments`, payload);
    return response.data;
  },

  async reactToPost(
    postId: string,
    reaction: ReactionType
  ): Promise<ApiResponse<string>> {
    const response = await httpClient.post<ApiResponse<string>>(
      `/Forums/posts/${postId}/react`,
      {}
    );
    return response.data;
  },

  async reactToComment(
    commentId: string,
    reaction: ReactionType
  ): Promise<ApiResponse<string>> {
    const response = await httpClient.post<ApiResponse<string>>(
      `/Forums/comments/${commentId}/react`,
      {}
    );
    return response.data;
  },
};
