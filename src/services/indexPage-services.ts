/**
 * Index Page Service
 * Handles data fetching for home page components
 * (testimonials, top lawyers, features, statistics)
 */

import { httpClient, type ApiResponse } from "./api/httpClient";

// ============ Types ============

export interface Testimonial {
  id: string;
  clientName: string;
  clientImage?: string;
  testimonialText: string;
  rating: number;
  lawyerName?: string;
  serviceCategory?: string;
  date?: string;
}

export interface LawyerCard {
  id: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  hourlyRate?: number;
  isVerified?: boolean;
  yearsOfExperience?: number;
  bio?: string;
}

export interface FeatureStatistic {
  id: string;
  label: string;
  value: string | number;
  description?: string;
  icon?: string;
}

export interface HomePageData {
  testimonials: Testimonial[];
  topLawyers: LawyerCard[];
  statistics: FeatureStatistic[];
}

// ============ Mock Data (Fallback) ============

const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    clientName: "أحمد محمد",
    testimonialText: "خدمة رائعة وموثوقة جداً. ساعدوني في قضيتي بشكل احترافي",
    rating: 5,
    lawyerName: "المحامي علي عبدالله",
    serviceCategory: "قانون العمل",
    date: "2024-01-15",
  },
  {
    id: "2",
    clientName: "فاطمة علي",
    testimonialText: "أفضل منصة قانونية استخدمتها. الاستشارات سريعة وفعالة",
    rating: 5,
    lawyerName: "المحامية سارة محمود",
    serviceCategory: "قانون الأسرة",
    date: "2024-01-20",
  },
  {
    id: "3",
    clientName: "محمد حسن",
    testimonialText: "تجربة ممتازة من البداية. المحامون محترفون جداً",
    rating: 4,
    lawyerName: "المحامي أحمد فرج",
    serviceCategory: "القانون التجاري",
    date: "2024-01-25",
  },
  {
    id: "4",
    clientName: "ليلى خالد",
    testimonialText: "منصة موثوقة جداً ونصائح قانونية قيمة",
    rating: 5,
    lawyerName: "المحامية منى إبراهيم",
    serviceCategory: "الملكية الفكرية",
    date: "2024-02-01",
  },
  {
    id: "5",
    clientName: "ياسر عطا",
    testimonialText: "الدعم رائع والمحامون خبراء في تخصصاتهم",
    rating: 5,
    lawyerName: "المحامي خالد محمد",
    serviceCategory: "قانون العقود",
    date: "2024-02-05",
  },
  {
    id: "6",
    clientName: "نور أحمد",
    testimonialText: "أنصح بشدة باستخدام وكيلي. خدمة احترافية وسريعة",
    rating: 4,
    lawyerName: "المحامي إبراهيم سالم",
    serviceCategory: "القانون الإداري",
    date: "2024-02-10",
  },
];

const MOCK_TOP_LAWYERS: LawyerCard[] = [
  {
    id: "1",
    firstName: "علي",
    lastName: "عبدالله",
    profileImage: "/api/placeholder/lawyer-1",
    specialties: ["قانون العمل", "القانون التجاري"],
    rating: 4.9,
    reviewCount: 248,
    hourlyRate: 250,
    isVerified: true,
    yearsOfExperience: 15,
    bio: "محام متخصص في قانون العمل والعقود",
  },
  {
    id: "2",
    firstName: "سارة",
    lastName: "محمود",
    profileImage: "/api/placeholder/lawyer-2",
    specialties: ["قانون الأسرة", "قانون الأحوال الشخصية"],
    rating: 4.8,
    reviewCount: 312,
    hourlyRate: 200,
    isVerified: true,
    yearsOfExperience: 12,
    bio: "متخصصة في قضايا الأسرة والأحوال الشخصية",
  },
  {
    id: "3",
    firstName: "أحمد",
    lastName: "فرج",
    profileImage: "/api/placeholder/lawyer-3",
    specialties: ["القانون التجاري", "العقود"],
    rating: 4.7,
    reviewCount: 189,
    hourlyRate: 300,
    isVerified: true,
    yearsOfExperience: 18,
    bio: "خبير في المعاملات التجارية والعقود المعقدة",
  },
];

const MOCK_STATISTICS: FeatureStatistic[] = [
  {
    id: "1",
    label: "محامي معتمدين",
    value: "500+",
    description: "محامي موثقين ومعتمدين",
  },
  {
    id: "2",
    label: "قضية تم حلها",
    value: "2500+",
    description: "قضايا نجح فيها عملائنا",
  },
  {
    id: "3",
    label: "رضا العملاء",
    value: "98%",
    description: "معدل رضا عملائنا",
  },
  {
    id: "4",
    label: "ساعات استشارة",
    value: "10K+",
    description: "ساعات استشارة قانونية",
  },
];

// ============ Service ============

export const indexPageService = {
  /**
   * Get homepage data (testimonials, top lawyers, statistics)
   * GET /home/data
   */
  async getHomePageData(): Promise<ApiResponse<HomePageData>> {
    const response = await httpClient.get<HomePageData>("/home/data");

    // Fallback to mock data if request fails or returns empty
    if (!response.success || !response.data) {
      return {
        success: true,
        data: {
          testimonials: MOCK_TESTIMONIALS,
          topLawyers: MOCK_TOP_LAWYERS,
          statistics: MOCK_STATISTICS,
        },
      };
    }

    // Ensure all fields have data, use mock as fallback for missing parts
    return {
      success: true,
      data: {
        testimonials:
          response.data.testimonials && response.data.testimonials.length > 0
            ? response.data.testimonials
            : MOCK_TESTIMONIALS,
        topLawyers:
          response.data.topLawyers && response.data.topLawyers.length > 0
            ? response.data.topLawyers
            : MOCK_TOP_LAWYERS,
        statistics:
          response.data.statistics && response.data.statistics.length > 0
            ? response.data.statistics
            : MOCK_STATISTICS,
      },
    };
  },

  /**
   * Get testimonials only
   * GET /testimonials?limit=6
   */
  async getTestimonials(
    limit: number = 6,
  ): Promise<ApiResponse<Testimonial[]>> {
    const response = await httpClient.get<Testimonial[]>("/testimonials", {
      params: { limit },
    });

    // Fallback to mock data
    if (!response.success || !response.data) {
      return {
        success: true,
        data: MOCK_TESTIMONIALS.slice(0, limit),
      };
    }

    return response;
  },

  /**
   * Get top lawyers
   * GET /lawyers/top?limit=3
   */
  async getTopLawyers(limit: number = 3): Promise<ApiResponse<LawyerCard[]>> {
    const response = await httpClient.get<LawyerCard[]>("/lawyers/top", {
      params: { limit },
    });

    // Fallback to mock data
    if (!response.success || !response.data) {
      return {
        success: true,
        data: MOCK_TOP_LAWYERS.slice(0, limit),
      };
    }

    return response;
  },

  /**
   * Get feature statistics
   * GET /statistics
   */
  async getStatistics(): Promise<ApiResponse<FeatureStatistic[]>> {
    const response = await httpClient.get<FeatureStatistic[]>("/statistics");

    // Fallback to mock data
    if (!response.success || !response.data) {
      return {
        success: true,
        data: MOCK_STATISTICS,
      };
    }

    return response;
  },
};

export default indexPageService;
