import httpClient, { type ApiResponse } from "./api/httpClient";

export type LawyerSessionType = "phone" | "office";

export interface LawyerProfileStats {
  numOfAppointmentsCompleted: number;
  yearsOfExperience: number;
  articlesPublishedCount: number;
  clientRatingAverage: number;
  reviewsTotal: number;
}

export interface LawyerProfileCore {
  id: string;
  profileImage: string | null;
  firstName: string;
  lastName: string;
  bio: string;
  summary: string;
  city: string | null;
  country: string | null;
  practiceAreas: string[];
  stats: LawyerProfileStats;
}

export interface LawyerSessionPricing {
  phonePrice: number;
  officePrice: number;
  // 0 -> Phone, 1 -> Office
  availableSessionTypes: number[];
}

export interface WorkExperience {
  jobTitle: string;
  organizationName: string;
  startYear: string;
  endYear: string;
  isCurrentJob: boolean;
  description: string;
}

export interface Education {
  degreeType: string;
  fieldOfStudy: string;
  universityName: string;
  graduationYear: string | null;
}

export interface Certification {
  certificateName: string;
  issuingOrganization: string;
  yearObtained: string;
}
export interface Client {
  firstName: string;
  lastName: string;
  profileImageUrl: string;
}
export interface Review {
  rating: number;
  comment: string;
  date: string;
  client: Client;
}
export interface LawyerProfileResponse {
  profile: LawyerProfileCore;
  pricing: LawyerSessionPricing;
  workHistory: WorkExperience[];
  education: Education[];
  certifications: Certification[];
  topReviews: Review[];
}

export const lawyerProfileServices = {
  async getLawyerProfile(id: string): Promise<LawyerProfileResponse> {
    const response = await httpClient.get<ApiResponse<LawyerProfileResponse>>(
      `/Lawyers/public/${id}`,
    );
    console.log("Raw API Response:", response.data);
    console.log("response.data.data:", response.data.data);
    if (!response.data.data) {
      throw new Error(response.data.error || "Failed to fetch lawyer profile");
    }
    return response.data.data;
  },
};
export default lawyerProfileServices;
