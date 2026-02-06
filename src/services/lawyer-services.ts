/**
 * Lawyer Service
 * Handles lawyer profile, onboarding, and verification
 */

import { httpClient, type ApiResponse } from "./api/httpClient";

// ============ Types ============

export interface LawyerBasicInfo {
  fullName: string;
  email: string;
  profileImage: string | null;
  phoneCode: string;
  phoneNumber: string;
  country: string;
  city: string;
  bio: string;
  yearsOfExperience: string;
  practiceAreas: string[];
  sessionTypes: string[];
}

export interface Education {
  id: string;
  degreeType: string;
  fieldOfStudy: string;
  universityName: string;
  graduationYear: string;
}

export interface ProfessionalCertification {
  id: string;
  certificateName: string;
  issuingOrganization: string;
  yearObtained: string;
  document: string | null;
}

export interface EducationData {
  academicQualifications: Education[];
  professionalCertifications: ProfessionalCertification[];
}

export interface WorkExperience {
  id: string;
  jobTitle: string;
  organizationName: string;
  startYear: string;
  endYear: string;
  isCurrentJob: boolean;
  description: string;
}

export interface ExperienceData {
  workExperiences: WorkExperience[];
}

export interface VerificationDocument {
  file: string | null;
  fileName: string | null;
  status: "pending" | "uploaded";
}

export interface VerificationData {
  nationalIdFront: VerificationDocument;
  nationalIdBack: VerificationDocument;
  lawyerLicense: VerificationDocument;
  educationalCertificates: VerificationDocument[];
  professionalCertificates: VerificationDocument[];
}

export interface LawyerOnboardingData {
  basicInfo: LawyerBasicInfo;
  education: EducationData;
  experience: ExperienceData;
  verification: VerificationData;
}

export interface OnboardingSubmitRequest {
  step: number;
  data: Partial<LawyerOnboardingData>;
}

export interface OnboardingProgress {
  currentStep: number;
  completedSteps: number[];
  data: Partial<LawyerOnboardingData>;
  lastUpdated: string;
}

// ============ Service ============

export const lawyerService = {
  /**
   * Save basic info step (Step 1)
   * POST /lawyer/onboarding/basic-info
   */
  async saveBasicInfo(
    data: LawyerBasicInfo,
  ): Promise<ApiResponse<{ message: string; progress: OnboardingProgress }>> {
    return httpClient.post<{ message: string; progress: OnboardingProgress }>(
      "/lawyer/onboarding/basic-info",
      data,
    );
  },

  /**
   * Save education step (Step 2)
   * POST /lawyer/onboarding/education
   */
  async saveEducation(
    data: EducationData,
  ): Promise<ApiResponse<{ message: string; progress: OnboardingProgress }>> {
    return httpClient.post<{ message: string; progress: OnboardingProgress }>(
      "/lawyer/onboarding/education",
      data,
    );
  },

  /**
   * Save experience step (Step 3)
   * POST /lawyer/onboarding/experience
   */
  async saveExperience(
    data: ExperienceData,
  ): Promise<ApiResponse<{ message: string; progress: OnboardingProgress }>> {
    return httpClient.post<{ message: string; progress: OnboardingProgress }>(
      "/lawyer/onboarding/experience",
      data,
    );
  },

  /**
   * Upload verification documents (Step 4)
   * POST /lawyer/onboarding/verification
   */
  async uploadVerificationDocuments(
    data: VerificationData,
  ): Promise<ApiResponse<{ message: string; progress: OnboardingProgress }>> {
    return httpClient.post<{ message: string; progress: OnboardingProgress }>(
      "/lawyer/onboarding/verification",
      data,
    );
  },

  /**
   * Get current onboarding progress
   * GET /lawyer/onboarding/progress
   */
  async getOnboardingProgress(): Promise<ApiResponse<OnboardingProgress>> {
    return httpClient.get<OnboardingProgress>("/lawyer/onboarding/progress");
  },

  /**
   * Submit complete onboarding
   * POST /lawyer/onboarding/submit
   */
  async submitOnboarding(
    data: LawyerOnboardingData,
  ): Promise<ApiResponse<{ message: string; lawyerId: string }>> {
    return httpClient.post<{ message: string; lawyerId: string }>(
      "/lawyer/onboarding/submit",
      data,
    );
  },

  /**
   * Get lawyer profile
   * GET /lawyer/:id
   */
  async getLawyerProfile(lawyerId: string): Promise<
    ApiResponse<{
      id: string;
      firstName: string;
      lastName: string;
      bio: string;
      rating: number;
      reviewCount: number;
      yearsOfExperience: number;
      specialties: string[];
      hourlyRate: number;
      profileImage: string;
      isVerified: boolean;
      phoneNumber: string;
      email: string;
      city: string;
      country: string;
    }>
  > {
    return httpClient.get(`/lawyers/${lawyerId}`);
  },

  /**
   * Search lawyers with filters
   * GET /lawyers/search?query=&specialties=&minRating=&maxPrice=
   */
  async searchLawyers(
    query?: string,
    specialties?: string[],
    minRating?: number,
    maxPrice?: number,
    limit?: number,
    offset?: number,
  ): Promise<
    ApiResponse<{
      lawyers: Array<{
        id: string;
        firstName: string;
        lastName: string;
        specialties: string[];
        rating: number;
        hourlyRate: number;
        profileImage: string;
        isVerified: boolean;
      }>;
      total: number;
    }>
  > {
    return httpClient.get("/lawyers/search", {
      params: {
        q: query || "",
        specialties: specialties?.join(",") || "",
        minRating: minRating || 0,
        maxPrice: maxPrice || 1000,
        limit: limit || 10,
        offset: offset || 0,
      },
    });
  },

  /**
   * Get lawyer reviews
   * GET /lawyer/:id/reviews
   */
  async getLawyerReviews(
    lawyerId: string,
    limit?: number,
    offset?: number,
  ): Promise<
    ApiResponse<{
      reviews: Array<{
        id: string;
        rating: number;
        comment: string;
        clientName: string;
        date: string;
      }>;
      total: number;
    }>
  > {
    return httpClient.get(`/lawyers/${lawyerId}/reviews`, {
      params: {
        limit: limit || 5,
        offset: offset || 0,
      },
    });
  },

  /**
   * Verify lawyer documents (admin endpoint simulation)
   * PATCH /lawyer/verification/:documentId
   * Note: In production, this would be called by admin panel
   */
  async verifyDocument(
    documentId: string,
    status: "approved" | "rejected",
    feedback?: string,
  ): Promise<ApiResponse<{ message: string }>> {
    return httpClient.patch(`/lawyer/verification/${documentId}`, {
      status,
      feedback,
    });
  },

  /**
   * Update lawyer profile
   * PUT /lawyer/profile
   */
  async updateLawyerProfile(
    data: Partial<LawyerBasicInfo>,
  ): Promise<ApiResponse<{ message: string; lawyer: LawyerBasicInfo }>> {
    return httpClient.put("/lawyer/profile", data);
  },

  /**
   * Upload profile image
   * POST /lawyer/profile/image (expects FormData)
   */
  async uploadProfileImage(file: File): Promise<
    ApiResponse<{
      message: string;
      imageUrl: string;
    }>
  > {
    const formData = new FormData();
    formData.append("image", file);

    // Note: This bypasses the JSON stringification in httpClient
    const token = localStorage.getItem("authToken");
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"}/lawyer/profile/image`,
      {
        method: "POST",
        headers,
        body: formData,
      },
    );

    if (!response.ok) {
      return {
        success: false,
        error: "Failed to upload image",
        statusCode: response.status,
      };
    }

    const data = await response.json();
    return {
      success: true,
      data,
      statusCode: response.status,
    };
  },
};

export default lawyerService;
