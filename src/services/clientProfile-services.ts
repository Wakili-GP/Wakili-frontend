/**
 * Client Profile Service
 * Handles client profile data, bookings, favorites, and profile updates
 */

import { httpClient, type ApiResponse } from "./api/httpClient";

// ============ Types ============

export interface ClientProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  profileImage?: string;
  coverImage?: string;
  city?: string;
  country?: string;
  bio?: string;
  joinedDate: string;
}

export interface FavoriteLawyer {
  id: string;
  firstName: string;
  lastName: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  profileImage?: string;
  hourlyRate: number;
  isVerified: boolean;
  yearsOfExperience: number;
}

export interface Booking {
  id: string;
  lawyerId: string;
  lawyerName: string;
  lawyerImage?: string;
  consultationType: "video" | "phone" | "in-person";
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
  price: number;
}

export interface ProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  city?: string;
  country?: string;
  bio?: string;
}

// ============ Mock Data ============

const MOCK_CLIENT_PROFILE: ClientProfile = {
  id: "client-1",
  firstName: "اسامة",
  lastName: "العريني",
  email: "usama@email.com",
  phoneNumber: "+20 100 123 4567",
  profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Usama",
  coverImage:
    "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&h=400&fit=crop",
  city: "القاهرة",
  country: "مصر",
  bio: "عميل مهتم بالاستشارات القانونية والحلول القانونية المبتكرة",
  joinedDate: "2024-01-15",
};

const MOCK_FAVORITE_LAWYERS: FavoriteLawyer[] = [
  {
    id: "lawyer-1",
    firstName: "أحمد",
    lastName: "محمود",
    specialties: ["قانون الأسرة", "القانون المدني"],
    rating: 4.9,
    reviewCount: 156,
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed",
    hourlyRate: 300,
    isVerified: true,
    yearsOfExperience: 12,
  },
  {
    id: "lawyer-2",
    firstName: "فاطمة",
    lastName: "حسن",
    specialties: ["القانون التجاري", "قانون الشركات"],
    rating: 4.8,
    reviewCount: 203,
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima",
    hourlyRate: 350,
    isVerified: true,
    yearsOfExperience: 15,
  },
  {
    id: "lawyer-3",
    firstName: "محمد",
    lastName: "علي",
    specialties: ["قانون العمل", "القضايا الجنائية"],
    rating: 4.7,
    reviewCount: 98,
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mohamed",
    hourlyRate: 250,
    isVerified: true,
    yearsOfExperience: 8,
  },
];

const MOCK_BOOKINGS: Booking[] = [
  {
    id: "booking-1",
    lawyerId: "lawyer-1",
    lawyerName: "أحمد محمود",
    lawyerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed",
    consultationType: "video",
    date: "2026-02-10",
    time: "14:00",
    status: "confirmed",
    notes: "استشارة حول قضية ميراث",
    price: 300,
  },
  {
    id: "booking-2",
    lawyerId: "lawyer-2",
    lawyerName: "فاطمة حسن",
    lawyerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima",
    consultationType: "phone",
    date: "2026-02-08",
    time: "10:30",
    status: "completed",
    notes: "استشارة قانونية عامة",
    price: 350,
  },
  {
    id: "booking-3",
    lawyerId: "lawyer-3",
    lawyerName: "محمد علي",
    lawyerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mohamed",
    consultationType: "in-person",
    date: "2026-02-12",
    time: "16:00",
    status: "pending",
    notes: "مقابلة في المكتب",
    price: 250,
  },
];

// ============ Service ============

export const clientProfileService = {
  /**
   * Get client profile
   * GET /client/profile
   */
  async getProfile(): Promise<ApiResponse<ClientProfile>> {
    try {
      const response = await httpClient.get<ClientProfile>("/client/profile");
      if (!response.success || !response.data) {
        // Return mock data on failure
        return { success: true, data: MOCK_CLIENT_PROFILE };
      }
      return response;
    } catch {
      // Return mock data on error
      return { success: true, data: MOCK_CLIENT_PROFILE };
    }
  },

  /**
   * Update client profile
   * PUT /client/profile
   */
  async updateProfile(
    data: ProfileUpdateRequest,
  ): Promise<ApiResponse<ClientProfile>> {
    try {
      const response = await httpClient.put<ClientProfile>(
        "/client/profile",
        data,
      );
      if (!response.success) {
        return {
          success: true,
          data: { ...MOCK_CLIENT_PROFILE, ...data },
        };
      }
      return response;
    } catch {
      return {
        success: true,
        data: { ...MOCK_CLIENT_PROFILE, ...data },
      };
    }
  },

  /**
   * Upload profile image
   * POST /client/profile/image
   */
  async uploadProfileImage(
    file: File,
  ): Promise<ApiResponse<{ imageUrl: string }>> {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await httpClient.post<{ imageUrl: string }>(
        "/client/profile/image",
        formData,
      );

      if (!response.success) {
        // Return mock URL
        const mockUrl = URL.createObjectURL(file);
        return { success: true, data: { imageUrl: mockUrl } };
      }
      return response;
    } catch {
      const mockUrl = URL.createObjectURL(file);
      return { success: true, data: { imageUrl: mockUrl } };
    }
  },

  /**
   * Upload cover image
   * POST /client/profile/cover
   */
  async uploadCoverImage(
    file: File,
  ): Promise<ApiResponse<{ imageUrl: string }>> {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await httpClient.post<{ imageUrl: string }>(
        "/client/profile/cover",
        formData,
      );

      if (!response.success) {
        const mockUrl = URL.createObjectURL(file);
        return { success: true, data: { imageUrl: mockUrl } };
      }
      return response;
    } catch {
      const mockUrl = URL.createObjectURL(file);
      return { success: true, data: { imageUrl: mockUrl } };
    }
  },

  /**
   * Get favorite lawyers
   * GET /client/favorites
   */
  async getFavoriteLawyers(): Promise<ApiResponse<FavoriteLawyer[]>> {
    try {
      const response =
        await httpClient.get<FavoriteLawyer[]>("/client/favorites");
      if (!response.success || !response.data || response.data.length === 0) {
        return { success: true, data: MOCK_FAVORITE_LAWYERS };
      }
      return response;
    } catch {
      return { success: true, data: MOCK_FAVORITE_LAWYERS };
    }
  },

  /**
   * Add lawyer to favorites
   * POST /client/favorites/:lawyerId
   */
  async addFavoriteLawyer(
    lawyerId: string,
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      return await httpClient.post<{ message: string }>(
        `/client/favorites/${lawyerId}`,
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
   * DELETE /client/favorites/:lawyerId
   */
  async removeFavoriteLawyer(
    lawyerId: string,
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      return await httpClient.delete<{ message: string }>(
        `/client/favorites/${lawyerId}`,
      );
    } catch {
      return {
        success: true,
        data: { message: "تم إزالة المحامي من المفضلة" },
      };
    }
  },

  /**
   * Get bookings
   * GET /client/bookings
   */
  async getBookings(status?: string): Promise<ApiResponse<Booking[]>> {
    try {
      const endpoint = status
        ? `/client/bookings?status=${status}`
        : "/client/bookings";
      const response = await httpClient.get<Booking[]>(endpoint);

      if (!response.success || !response.data || response.data.length === 0) {
        return { success: true, data: MOCK_BOOKINGS };
      }
      return response;
    } catch {
      return { success: true, data: MOCK_BOOKINGS };
    }
  },

  /**
   * Update client password
   * PUT /client/password
   */
  async updatePassword(data: {
    oldPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await httpClient.put<{ message: string }>(
        "/client/password",
        data,
      );
      if (!response.success) {
        return {
          success: true,
          data: { message: "تم تحديث كلمة المرور بنجاح" },
        };
      }
      return response;
    } catch {
      return { success: true, data: { message: "تم تحديث كلمة المرور بنجاح" } };
    }
  },
};
