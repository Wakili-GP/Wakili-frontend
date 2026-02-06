/**
 * Lawyer Search Service
 * Handles lawyer search, filtering, and practice areas management
 */

import { httpClient, type ApiResponse } from "./api/httpClient";

// ============ Types ============

export interface Lawyer {
  id: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  specialty: string;
  specialties: string[];
  location: string;
  city: string;
  country: string;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  yearsOfExperience: number;
  sessionTypes: string[];
  bio?: string;
  isVerified: boolean;
  isFavorite?: boolean;
}

export interface PracticeArea {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface LawyerSearchParams {
  query?: string;
  practiceArea?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sessionTypes?: string[];
  sortBy?: string;
  page?: number;
  limit?: number;
}

export interface LawyerSearchResponse {
  data: Lawyer[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface LocationResponse {
  id: string;
  name: string;
  city: string;
  country: string;
}

// ============ Mock Data ============

const MOCK_LAWYERS: Lawyer[] = [
  {
    id: "lawyer-1",
    firstName: "أحمد",
    lastName: "سليمان",
    specialty: "قانون تجاري",
    specialties: ["قانون تجاري", "القانون المالي"],
    location: "القاهرة",
    city: "القاهرة",
    country: "مصر",
    rating: 4.9,
    reviewCount: 127,
    hourlyRate: 500,
    sessionTypes: ["مكتب", "هاتف"],
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed1",
    yearsOfExperience: 15,
    isVerified: true,
    bio: "متخصص في القانون التجاري والعقود التجارية",
  },
  {
    id: "lawyer-2",
    firstName: "سارة",
    lastName: "محمود",
    specialty: "قانون الأسرة",
    specialties: ["قانون الأسرة", "قانون الميراث"],
    location: "الإسكندرية",
    city: "الإسكندرية",
    country: "مصر",
    rating: 4.8,
    reviewCount: 89,
    hourlyRate: 350,
    sessionTypes: ["مكتب", "هاتف"],
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    yearsOfExperience: 10,
    isVerified: true,
    bio: "متخصصة في قضايا الأسرة والحقوق الزوجية",
  },
  {
    id: "lawyer-3",
    firstName: "محمد",
    lastName: "علي",
    specialty: "قانون جنائي",
    specialties: ["قانون جنائي", "الدفاع الجنائي"],
    location: "الجيزة",
    city: "الجيزة",
    country: "مصر",
    rating: 4.7,
    reviewCount: 156,
    hourlyRate: 600,
    sessionTypes: ["مكتب"],
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mohamed1",
    yearsOfExperience: 20,
    isVerified: true,
    bio: "خبرة واسعة في الدفاع الجنائي",
  },
  {
    id: "lawyer-4",
    firstName: "فاطمة",
    lastName: "حسن",
    specialty: "قانون العمل",
    specialties: ["قانون العمل", "حقوق الموظفين"],
    location: "القاهرة",
    city: "القاهرة",
    country: "مصر",
    rating: 4.9,
    reviewCount: 203,
    hourlyRate: 450,
    sessionTypes: ["هاتف"],
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima",
    yearsOfExperience: 12,
    isVerified: true,
    bio: "متخصصة في نزاعات العمل",
  },
  {
    id: "lawyer-5",
    firstName: "عمر",
    lastName: "خالد",
    specialty: "قانون مدني",
    specialties: ["قانون مدني", "المسؤولية المدنية"],
    location: "المنصورة",
    city: "المنصورة",
    country: "مصر",
    rating: 4.6,
    reviewCount: 78,
    hourlyRate: 300,
    sessionTypes: ["مكتب", "هاتف"],
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Omar",
    yearsOfExperience: 8,
    isVerified: false,
    bio: "محامي متخصص في القضايا المدنية",
  },
  {
    id: "lawyer-6",
    firstName: "نورا",
    lastName: "عبدالله",
    specialty: "قانون تجاري",
    specialties: ["قانون تجاري", "قانون الشركات"],
    location: "القاهرة",
    city: "القاهرة",
    country: "مصر",
    rating: 4.8,
    reviewCount: 145,
    hourlyRate: 550,
    sessionTypes: ["مكتب"],
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nora",
    yearsOfExperience: 14,
    isVerified: true,
    bio: "متخصصة في عقود الشركات",
  },
  {
    id: "lawyer-7",
    firstName: "كريم",
    lastName: "مصطفى",
    specialty: "قانون الهجرة",
    specialties: ["قانون الهجرة", "تأشيرات"],
    location: "الإسكندرية",
    city: "الإسكندرية",
    country: "مصر",
    rating: 4.5,
    reviewCount: 67,
    hourlyRate: 400,
    sessionTypes: ["هاتف"],
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Karim",
    yearsOfExperience: 6,
    isVerified: true,
    bio: "متخصص في قوانين الهجرة الدولية",
  },
  {
    id: "lawyer-8",
    firstName: "هند",
    lastName: "السيد",
    specialty: "قانون الأسرة",
    specialties: ["قانون الأسرة", "الحضانة"],
    location: "طنطا",
    city: "طنطا",
    country: "مصر",
    rating: 4.7,
    reviewCount: 112,
    hourlyRate: 380,
    sessionTypes: ["مكتب", "هاتف"],
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hend",
    yearsOfExperience: 11,
    isVerified: true,
    bio: "متخصصة في قضايا الحضانة والأحوال الشخصية",
  },
  {
    id: "lawyer-9",
    firstName: "ياسر",
    lastName: "إبراهيم",
    specialty: "قانون جنائي",
    specialties: ["قانون جنائي", "الجرائم الاقتصادية"],
    location: "القاهرة",
    city: "القاهرة",
    country: "مصر",
    rating: 4.6,
    reviewCount: 95,
    hourlyRate: 480,
    sessionTypes: ["مكتب"],
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Yaser",
    yearsOfExperience: 9,
    isVerified: true,
    bio: "متخصص في الجرائم الاقتصادية",
  },
  {
    id: "lawyer-10",
    firstName: "ليلى",
    lastName: "أحمد",
    specialty: "قانون العمل",
    specialties: ["قانون العمل", "التأمينات الاجتماعية"],
    location: "الجيزة",
    city: "الجيزة",
    country: "مصر",
    rating: 4.8,
    reviewCount: 178,
    hourlyRate: 520,
    sessionTypes: ["مكتب", "هاتف"],
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Layla",
    yearsOfExperience: 13,
    isVerified: true,
    bio: "متخصصة في حقوق الموظفين",
  },
];

const MOCK_PRACTICE_AREAS: PracticeArea[] = [
  {
    id: "area-1",
    name: "قانون تجاري",
    description: "العقود والقانون التجاري والمالي",
  },
  {
    id: "area-2",
    name: "قانون الأسرة",
    description: "الزواج والطلاق والحضانة والميراث",
  },
  {
    id: "area-3",
    name: "قانون جنائي",
    description: "الدفاع الجنائي والقضايا الجنائية",
  },
  {
    id: "area-4",
    name: "قانون العمل",
    description: "حقوق الموظفين والمنازعات العمالية",
  },
  {
    id: "area-5",
    name: "قانون مدني",
    description: "المسؤولية المدنية والعقود المدنية",
  },
  {
    id: "area-6",
    name: "قانون الهجرة",
    description: "التأشيرات والهجرة والقانون الدولي",
  },
  {
    id: "area-7",
    name: "قانون العقارات",
    description: "العقارات والملكية والإيجار",
  },
  {
    id: "area-8",
    name: "قانون الشركات",
    description: "تأسيس الشركات والعقود التجارية",
  },
];

const MOCK_LOCATIONS: LocationResponse[] = [
  { id: "loc-1", name: "القاهرة", city: "القاهرة", country: "مصر" },
  { id: "loc-2", name: "الإسكندرية", city: "الإسكندرية", country: "مصر" },
  { id: "loc-3", name: "الجيزة", city: "الجيزة", country: "مصر" },
  { id: "loc-4", name: "المنصورة", city: "المنصورة", country: "مصر" },
  { id: "loc-5", name: "طنطا", city: "طنطا", country: "مصر" },
  { id: "loc-6", name: "أسيوط", city: "أسيوط", country: "مصر" },
  { id: "loc-7", name: "الأقصر", city: "الأقصر", country: "مصر" },
  { id: "loc-8", name: "أسوان", city: "أسوان", country: "مصر" },
];

// ============ Service ============

export const lawyerSearchService = {
  /**
   * Search lawyers with filters
   * GET /lawyer/search
   */
  async searchLawyers(
    params: LawyerSearchParams,
  ): Promise<ApiResponse<LawyerSearchResponse>> {
    try {
      // Build query string
      const queryParams = new URLSearchParams();
      if (params.query) queryParams.append("query", params.query);
      if (params.practiceArea)
        queryParams.append("practiceArea", params.practiceArea);
      if (params.location) queryParams.append("location", params.location);
      if (params.minPrice)
        queryParams.append("minPrice", params.minPrice.toString());
      if (params.maxPrice)
        queryParams.append("maxPrice", params.maxPrice.toString());
      if (params.minRating)
        queryParams.append("minRating", params.minRating.toString());
      if (params.sessionTypes && params.sessionTypes.length > 0) {
        queryParams.append("sessionTypes", params.sessionTypes.join(","));
      }
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());

      const response = await httpClient.get<LawyerSearchResponse>(
        `/lawyer/search?${queryParams.toString()}`,
      );

      if (!response.success || !response.data) {
        // Return mock data with filtering
        return {
          success: true,
          data: filterAndPaginateMockLawyers(params),
        };
      }
      return response;
    } catch {
      // Return mock data with filtering on error
      return {
        success: true,
        data: filterAndPaginateMockLawyers(params),
      };
    }
  },

  /**
   * Get all practice areas
   * GET /lawyer/practice-areas
   */
  async getPracticeAreas(): Promise<ApiResponse<PracticeArea[]>> {
    try {
      const response = await httpClient.get<PracticeArea[]>(
        "/lawyer/practice-areas",
      );
      if (!response.success || !response.data || response.data.length === 0) {
        return { success: true, data: MOCK_PRACTICE_AREAS };
      }
      return response;
    } catch {
      return { success: true, data: MOCK_PRACTICE_AREAS };
    }
  },

  /**
   * Get all locations
   * GET /lawyer/locations
   */
  async getLocations(): Promise<ApiResponse<LocationResponse[]>> {
    try {
      const response =
        await httpClient.get<LocationResponse[]>("/lawyer/locations");
      if (!response.success || !response.data || response.data.length === 0) {
        return { success: true, data: MOCK_LOCATIONS };
      }
      return response;
    } catch {
      return { success: true, data: MOCK_LOCATIONS };
    }
  },

  /**
   * Get lawyer details
   * GET /lawyer/:id
   */
  async getLawyerDetails(lawyerId: string): Promise<ApiResponse<Lawyer>> {
    try {
      const response = await httpClient.get<Lawyer>(`/lawyer/${lawyerId}`);
      if (!response.success || !response.data) {
        const mockLawyer = MOCK_LAWYERS.find((l) => l.id === lawyerId);
        if (mockLawyer) {
          return { success: true, data: mockLawyer };
        }
        return {
          success: false,
          error: "المحامي غير موجود",
        };
      }
      return response;
    } catch {
      const mockLawyer = MOCK_LAWYERS.find((l) => l.id === lawyerId);
      if (mockLawyer) {
        return { success: true, data: mockLawyer };
      }
      return {
        success: false,
        error: "حدث خطأ أثناء جلب بيانات المحامي",
      };
    }
  },

  /**
   * Add lawyer to favorites
   * POST /lawyer/:lawyerId/favorite
   */
  async addToFavorites(
    lawyerId: string,
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      return await httpClient.post<{ message: string }>(
        `/lawyer/${lawyerId}/favorite`,
        {},
      );
    } catch {
      return {
        success: true,
        data: { message: "تم إضافة المحامي إلى المفضلة" },
      };
    }
  },

  /**
   * Remove lawyer from favorites
   * DELETE /lawyer/:lawyerId/favorite
   */
  async removeFromFavorites(
    lawyerId: string,
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      return await httpClient.delete<{ message: string }>(
        `/lawyer/${lawyerId}/favorite`,
      );
    } catch {
      return {
        success: true,
        data: { message: "تم إزالة المحامي من المفضلة" },
      };
    }
  },
};

// ============ Helper Functions ============

function filterAndPaginateMockLawyers(
  params: LawyerSearchParams,
): LawyerSearchResponse {
  const page = params.page || 1;
  const limit = params.limit || 6;

  let filtered = MOCK_LAWYERS.filter((lawyer) => {
    if (params.query) {
      const query = params.query.toLowerCase();
      const matchesQuery =
        lawyer.firstName.toLowerCase().includes(query) ||
        lawyer.lastName.toLowerCase().includes(query) ||
        lawyer.specialty.toLowerCase().includes(query) ||
        lawyer.specialties.some((s) => s.toLowerCase().includes(query));
      if (!matchesQuery) {
        return false;
      }
    }

    if (
      params.practiceArea &&
      params.practiceArea !== "all" &&
      !lawyer.specialties.includes(params.practiceArea)
    ) {
      return false;
    }

    if (
      params.location &&
      params.location !== "all" &&
      lawyer.city !== params.location
    ) {
      return false;
    }

    if (params.minPrice !== undefined && lawyer.hourlyRate < params.minPrice) {
      return false;
    }

    if (params.maxPrice !== undefined && lawyer.hourlyRate > params.maxPrice) {
      return false;
    }

    if (params.minRating !== undefined && lawyer.rating < params.minRating) {
      return false;
    }

    if (
      params.sessionTypes &&
      params.sessionTypes.length > 0 &&
      !params.sessionTypes.some((type) => lawyer.sessionTypes.includes(type))
    ) {
      return false;
    }

    return true;
  });

  // Sort
  if (params.sortBy) {
    switch (params.sortBy) {
      case "rating":
        filtered = filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "price-low":
        filtered = filtered.sort((a, b) => a.hourlyRate - b.hourlyRate);
        break;
      case "price-high":
        filtered = filtered.sort((a, b) => b.hourlyRate - a.hourlyRate);
        break;
      case "reviews":
        filtered = filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        break;
    }
  }

  // Paginate
  const startIndex = (page - 1) * limit;
  const paginatedData = filtered.slice(startIndex, startIndex + limit);
  const totalPages = Math.ceil(filtered.length / limit);

  return {
    data: paginatedData,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: filtered.length,
      itemsPerPage: limit,
    },
  };
}
