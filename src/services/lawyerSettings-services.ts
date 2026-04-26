import httpClient, { type ApiResponse } from "./api/httpClient";

export interface LawyerProfile {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  city: string;
  country: string;
  bio: string;
  summary: string | null;
  phoneSessionPrice: number | null;
  inOfficeSessionPrice: number | null;
  profileImage: string | null;
  memberSince: string;
  email: string;
}

export interface UpdateLawyerProfilePayload {
  phoneNumber?: string;
  profileImage?: File;
  city?: string;
  country?: string;
  bio?: string;
  summary?: string | null;
  phoneSessionPrice?: number | null;
  inOfficeSessionPrice?: number | null;
}

const lawyerSettingsServices = {
  async getProfile(): Promise<LawyerProfile> {
    const response = await httpClient.get<ApiResponse<LawyerProfile>>(
      "/Account/lawyer-info",
    );
    if (!response.data.success || !response.data.data)
      throw new Error(response.data.error || "Failed to fetch profile");
    return response.data.data;
  },
  async updateProfile(
    profile: UpdateLawyerProfilePayload,
  ): Promise<LawyerProfile> {
    const formData = new FormData();
    if (profile.phoneNumber) {
      formData.append("PhoneNumber", profile.phoneNumber);
    }
    if (profile.profileImage) {
      formData.append("ProfileImage", profile.profileImage);
    }

    if (profile.city) {
      formData.append("City", profile.city);
    }
    if (profile.country) {
      formData.append("Country", profile.country);
    }
    if (profile.bio) {
      formData.append("Bio", profile.bio);
    }
    if (profile.summary) {
      formData.append("Summary", profile.summary);
    }
    if (
      profile.phoneSessionPrice !== undefined &&
      profile.phoneSessionPrice !== null
    ) {
      formData.append(
        "PhoneSessionPrice",
        profile.phoneSessionPrice.toString(),
      );
    }
    if (
      profile.inOfficeSessionPrice !== undefined &&
      profile.inOfficeSessionPrice !== null
    ) {
      formData.append(
        "InOfficeSessionPrice",
        profile.inOfficeSessionPrice.toString(),
      );
    }
    const response = await httpClient.put<LawyerProfile>(
      "/Account/lawyer-info",
      formData,
    );
    return response.data;
  },
};

export default lawyerSettingsServices;
