// ── Forum Data Models ──

export type ForumPostStatus = 'pending' | 'approved' | 'rejected';
export type ReactionType = 'like' | 'helpful' | 'insightful';

export interface ForumCategory {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  color: string;
}

export interface ForumAuthor {
  id: string;
  firstName: string;
  lastName: string;
  profileImage: string | null;
  userType: 'Client' | 'Lawyer';
  specialization?: string;
}

export interface ForumPost {
  id: string;
  title: string;
  body: string;
  category: ForumCategory;
  author: ForumAuthor;
  status: ForumPostStatus;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
}

export interface ForumComment {
  id: string;
  postId: string;
  parentId: string | null;
  body: string;
  author: ForumAuthor;
  createdAt: string;
  reactions: { like: number; helpful: number; insightful: number };
  userReaction: ReactionType | null;
  replies: ForumComment[];
}

// ── Request / Response Types ──

export interface ForumSearchParams {
  keyword?: string;
  category?: string;
  sortBy?: 'newest' | 'most_liked' | 'most_commented' | 'unanswered';
  status?: ForumPostStatus;
  page?: number;
  limit?: number;
}

export interface ForumPostSubmission {
  title: string;
  body: string;
  categoryId: string;
  tags: string[];
}

export interface ForumPostsResponse {
  posts: ForumPost[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ForumStats {
  totalQuestions: number;
  totalAnswers: number;
  activeUsers: number;
  resolvedQuestions: number;
}

// ── Predefined Categories ──

export const FORUM_CATEGORIES: ForumCategory[] = [
  { id: '1', name: 'Family Law', nameAr: 'قانون الأسرة', slug: 'family-law', color: '#E91E63' },
  { id: '2', name: 'Criminal Law', nameAr: 'القانون الجنائي', slug: 'criminal-law', color: '#F44336' },
  { id: '3', name: 'Corporate', nameAr: 'قانون الشركات', slug: 'corporate', color: '#2196F3' },
  { id: '4', name: 'Immigration', nameAr: 'قانون الهجرة', slug: 'immigration', color: '#4CAF50' },
  { id: '5', name: 'Real Estate', nameAr: 'العقارات', slug: 'real-estate', color: '#FF9800' },
  { id: '6', name: 'Intellectual Property', nameAr: 'الملكية الفكرية', slug: 'intellectual-property', color: '#9C27B0' },
  { id: '7', name: 'Tax Law', nameAr: 'قانون الضرائب', slug: 'tax-law', color: '#00BCD4' },
  { id: '8', name: 'Human Rights', nameAr: 'حقوق الإنسان', slug: 'human-rights', color: '#FF5722' },
  { id: '9', name: 'Labor Law', nameAr: 'قانون العمل', slug: 'labor-law', color: '#607D8B' },
  { id: '10', name: 'Commercial Law', nameAr: 'القانون التجاري', slug: 'commercial-law', color: '#795548' },
];
