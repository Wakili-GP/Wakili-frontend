// ── Forum Data Models ──

export type ForumPostStatus = 'Pending' | 'Approved' | 'Rejected';
export type ReactionType = 'like'; // Simplified

export interface ForumSpecialization {
  id: number;
  name: string;
}

export interface ForumAuthor {
  id: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string | null;
}

export interface ForumPost {
  id: string;
  title: string;
  body: string;
  specialization: ForumSpecialization;
  author: ForumAuthor;
  status: string; // From backend (e.g. 'Approved')
  tags: string[];
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
}

export interface ForumComment {
  id: string;
  postId?: string;
  parentId: string | null;
  body: string;
  author: ForumAuthor;
  createdAt: string;
  likesCount: number;
  isLiked: boolean;
  replies: ForumComment[];
}

// ── Request / Response Types ──

export interface ForumSearchParams {
  keyword?: string;
  specializationId?: number;
  sortBy?: 'newest' | 'most_liked' | 'most_commented' | 'unanswered';
  page?: number;
  limit?: number;
}

export interface ForumPostSubmission {
  title: string;
  body: string;
  specializationId: string;
  tags: string[];
}

export interface ForumPostsResponse {
  items: ForumPost[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface ForumStats {
  totalQuestions: number;
  totalAnswers: number;
  activeUsers: number;
  resolvedQuestions: number;
}

// ── Predefined Specializations (Matches Backend Seeds if applicable) ──

export const FORUM_SPECIALIZATIONS = [
  { id: 1, name: 'Family Law', nameAr: 'قانون الأسرة' },
  { id: 2, name: 'Criminal Law', nameAr: 'القانون الجنائي' },
  { id: 3, name: 'Corporate', nameAr: 'قانون الشركات' },
  { id: 4, name: 'Immigration', nameAr: 'قانون الهجرة' },
  { id: 5, name: 'Real Estate', nameAr: 'العقارات' },
  { id: 6, name: 'Intellectual Property', nameAr: 'الملكية الفكرية' },
  { id: 7, name: 'Tax Law', nameAr: 'قانون الضرائب' },
  { id: 8, name: 'Human Rights', nameAr: 'حقوق الإنسان' },
  { id: 9, name: 'Labor Law', nameAr: 'قانون العمل' },
  { id: 10, name: 'Commercial Law', nameAr: 'القانون التجاري' },
];
