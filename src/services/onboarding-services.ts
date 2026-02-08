/**
 * Lawyer Service
 * Handles lawyer profile, onboarding, and verification
 */

import { httpClient, type ApiResponse } from "./api/httpClient";

// ============ Types ============

export interface LawyerBasicInfo {
  id: string;
  fullName: string;
  email: string;
  profileImage: string | null;
  phoneCode: string;
  phoneNumber: string;
  country: string;
  city: string;
  bio: string;
  yearsOfExperience: string;
  practiceAreas: number[]; // Stores specialization IDs
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

// ============ Helper Functions ============

/**
 * Helper to make multipart requests
 */
const makeMultipartRequest = async <T>(
  endpoint: string,
  formDataBuilder: (fd: FormData) => void,
): Promise<ApiResponse<T>> => {
  const formData = new FormData();
  formDataBuilder(formData);

  const token = localStorage.getItem("authToken");
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const baseURL =
    import.meta.env.MODE === "development"
      ? "/api"
      : import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

  try {
    const response = await fetch(`${baseURL}${endpoint}`, {
      method: "POST",
      headers,
      body: formData,
    });

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      const errorMessage =
        typeof data === "string"
          ? data
          : data?.error || data?.message || "Request failed";
      return {
        success: false,
        error: errorMessage,
        statusCode: response.status,
        data,
      };
    }

    return {
      success: true,
      data: typeof data === "string" ? (data as T) : data,
      statusCode: response.status,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
      statusCode: 0,
    };
  }
};

/**
 * Helper to convert base64 to File
 */
const base64ToFile = (
  base64: string,
  filename: string,
  mime: string = "application/pdf",
): File => {
  const arr = base64.split(",");
  const actualMime = arr[0].match(/:(.*?);/)?.[1] || mime;
  const bstr = atob(arr[1]);
  const n = bstr.length;
  const u8arr = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }
  return new File([u8arr], filename, { type: actualMime });
};

// ============ Service ============

export const lawyerService = {
  /**
   * Save basic info step (Step 1)
   * POST /api/lawyer/onboarding/basic-info (multipart/form-data)
   */
  async saveBasicInfo(data: LawyerBasicInfo): Promise<ApiResponse<string>> {
    const userId = localStorage.getItem("userId") || "";
    return makeMultipartRequest<string>(
      "/lawyer/onboarding/basic-info",
      (formData) => {
        formData.append("UserId", userId);

        // Convert base64 profile image to File if present
        if (data.profileImage && data.profileImage.startsWith("data:")) {
          const file = base64ToFile(
            data.profileImage,
            "profile.jpg",
            "image/jpeg",
          );
          formData.append("ProfileImage", file);
        }

        // Combine phone code and number (e.g., +20123456789)
        const fullPhoneNumber = `${data.phoneCode}${data.phoneNumber}`;
        formData.append("PhoneNumber", fullPhoneNumber);
        formData.append("Country", data.country);
        formData.append("City", data.city);
        formData.append("Bio", data.bio);
        formData.append("YearsOfExperience", data.yearsOfExperience);
        data.practiceAreas.forEach((areaId) => {
          formData.append("PracticeAreas", areaId.toString());
        });
        data.sessionTypes.forEach((type) => {
          formData.append("SessionTypes", type);
        });
      },
    );
  },

  /**
   * Save education step (Step 2)
   * POST /api/lawyer/onboarding/education (multipart/form-data)
   */
  async saveEducation(data: EducationData): Promise<ApiResponse<string>> {
    const userId = localStorage.getItem("userId") || "";
    return makeMultipartRequest<string>(
      "/lawyer/onboarding/education",
      (formData) => {
        formData.append("UserId", userId);

        // Append academic qualifications
        data.academicQualifications.forEach((qual, index) => {
          formData.append(
            `AcademicQualifications[${index}].degreeType`,
            qual.degreeType,
          );
          formData.append(
            `AcademicQualifications[${index}].fieldOfStudy`,
            qual.fieldOfStudy,
          );
          formData.append(
            `AcademicQualifications[${index}].universityName`,
            qual.universityName,
          );
          formData.append(
            `AcademicQualifications[${index}].graduationYear`,
            qual.graduationYear,
          );
        });

        // Append professional certifications with file conversion
        data.professionalCertifications.forEach((cert, index) => {
          formData.append(
            `ProfessionalCertifications[${index}].certificateName`,
            cert.certificateName,
          );
          formData.append(
            `ProfessionalCertifications[${index}].issuingOrganization`,
            cert.issuingOrganization,
          );
          formData.append(
            `ProfessionalCertifications[${index}].yearObtained`,
            cert.yearObtained,
          );

          // Convert base64 to File if present
          if (cert.document && cert.document.startsWith("data:")) {
            const file = base64ToFile(cert.document, `cert-${index}.pdf`);
            formData.append(
              `ProfessionalCertifications[${index}].document`,
              file,
            );
          }
        });
      },
    );
  },

  /**
   * Save experience step (Step 3)
   * POST /api/lawyer/onboarding/experience (application/json)
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
   * POST /api/lawyer/onboarding/verification (multipart/form-data)
   */
  async uploadVerificationDocuments(
    data: VerificationData & {
      licenseNumber: string;
      issuingAuthority: string;
      yearOfIssue: string;
    },
  ): Promise<ApiResponse<string>> {
    const userId = localStorage.getItem("userId") || "";
    return makeMultipartRequest<string>(
      "/lawyer/onboarding/verification",
      (formData) => {
        formData.append("UserId", userId);

        // National ID files
        if (
          data.nationalIdFront.file &&
          data.nationalIdFront.file.startsWith("data:")
        ) {
          formData.append(
            "NationalIdFront",
            base64ToFile(data.nationalIdFront.file, "id-front.pdf"),
          );
        }
        if (
          data.nationalIdBack.file &&
          data.nationalIdBack.file.startsWith("data:")
        ) {
          formData.append(
            "NationalIdBack",
            base64ToFile(data.nationalIdBack.file, "id-back.pdf"),
          );
        }

        // Lawyer license
        if (
          data.lawyerLicense.file &&
          data.lawyerLicense.file.startsWith("data:")
        ) {
          formData.append(
            "License.LicenseFile",
            base64ToFile(data.lawyerLicense.file, "license.pdf"),
          );
        }
        formData.append("License.LicenseNumber", data.licenseNumber);
        formData.append("License.IssuingAuthority", data.issuingAuthority);
        formData.append("License.LicenseYear", data.yearOfIssue);

        // Educational certificates
        data.educationalCertificates.forEach((cert, index) => {
          if (cert.file && cert.file.startsWith("data:")) {
            formData.append(
              `EducationalCertificates[${index}]`,
              base64ToFile(cert.file, `edu-cert-${index}.pdf`),
            );
          }
        });

        // Professional certificates
        data.professionalCertificates.forEach((cert, index) => {
          if (cert.file && cert.file.startsWith("data:")) {
            formData.append(
              `ProfessionalCertificates[${index}]`,
              base64ToFile(cert.file, `prof-cert-${index}.pdf`),
            );
          }
        });
      },
    );
  },

  /**
   * Get current onboarding progress
   * GET /api/lawyer/onboarding/progress
   */
  async getOnboardingProgress(): Promise<ApiResponse<OnboardingProgress>> {
    return httpClient.get<OnboardingProgress>("/lawyer/onboarding/progress");
  },

  /**
   * Submit complete onboarding
   * Note: Submission happens automatically after each step
   * This function is kept for backward compatibility
   */
  async submitOnboarding(): Promise<
    ApiResponse<{ message: string; lawyerId: string }>
  > {
    // In the new API, submission happens gradually as each step is saved
    return {
      success: true,
      data: { message: "Onboarding completed", lawyerId: "" },
      statusCode: 200,
    };
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
