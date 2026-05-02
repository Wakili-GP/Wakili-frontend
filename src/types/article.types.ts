// ── Article Data Models ──

export type ArticleStatus = 'draft' | 'under_review' | 'published' | 'rejected';
export type VoteType = 'up' | 'down';

export interface ArticleCategory {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  color: string;
}

export interface ArticleAuthor {
  id: string;
  firstName: string;
  lastName: string;
  profileImage: string | null;
  specialization?: string;
  bio?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;              // HTML from TipTap
  coverImage: string;
  category: ArticleCategory;
  tags: string[];
  author: ArticleAuthor;
  status: ArticleStatus;
  rejectionReason?: string;
  publishedAt?: string;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
  readTimeMinutes: number;
  totalReads: number;
  upvotes: number;
  downvotes: number;
  userVote?: VoteType | null; // Current user's vote
}

export interface ArticleVote {
  id: string;
  articleId: string;
  userId: string;
  vote: VoteType;
  createdAt: string;
}

export interface ArticleRead {
  id: string;
  articleId: string;
  userId?: string;
  sessionId: string;
  readAt: string;
}

// ── Request / Response Types ──

export interface ArticleSearchParams {
  keyword?: string;
  category?: string;
  authorId?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'newest' | 'most_liked' | 'most_read' | 'most_recent';
  page?: number;
  limit?: number;
}

export interface ArticleSubmission {
  title: string;
  excerpt: string;
  body: string;
  coverImage: string;
  categoryId: string;
  tags: string[];
  visibility?: 'public' | 'unlisted';
  scheduledPublishDate?: string;
}

export interface ArticlesResponse {
  articles: Article[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ArticleStats {
  totalArticles: number;
  totalUpvotes: number;
  totalReads: number;
  totalReadTimeGenerated: number;
}

// ── Predefined Categories ──

export const ARTICLE_CATEGORIES: ArticleCategory[] = [
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
