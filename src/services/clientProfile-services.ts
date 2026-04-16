import httpClient, { type ApiResponse } from "@/services/api/httpClient";
import fileService from "@/services/files-services";

export interface ClientProfileInterface {
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  city: string | null;
  country: string | null;
  profileImage: string | null;
  bio: string | null;
  memberSince: string;
  email: string;
}

export interface ClientProfileUpdatePayload {
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  city: string | null;
  country: string | null;
  profileImage: File | string | null;
  bio: string | null;
}
// Status
// Pending: 0
// Confirmed: 1
// Cancelled: 2
// Completed: 3

// Session Types
// InOffice: 0
// Phone: 1

export interface ClientBookingInterface {
  id: string;
  status: "قيد الانتظار" | "مؤكد" | "ملغي" | "مكتمل";
  createdAt: string;
  confirmedAt: string | null;
  cancelledAt: string | null;
  completedAt: string | null;
  sessionDate: string;
  startTime: string;
  endTime: string;
  sessionType: 0 | 1;
  lawyerFirstName: string;
  lawyerLastName: string;
  lawyerProfileImage: string | null;
  lawyerId: string;
}

interface ClientBookingApiModel {
  id: string;
  status: 0 | 1 | 2 | 3;
  createdAt: string;
  confirmedAt: string | null;
  cancelledAt: string | null;
  completedAt: string | null;
  sessionDate: string;
  startTime: string;
  endTime: string;
  sessionType: 0 | 1;
  lawyerFirstName: string;
  lawyerLastName: string;
  lawyerProfileImage: string | null;
  lawyerId: string;
}

const BOOKING_STATUS_MAP: Record<
  ClientBookingApiModel["status"],
  ClientBookingInterface["status"]
> = {
  0: "قيد الانتظار",
  1: "مؤكد",
  2: "ملغي",
  3: "مكتمل",
};

export const clientProfileService = {
  async getClientProfile(): Promise<ApiResponse<ClientProfileInterface>> {
    const response = await httpClient.get<ApiResponse<ClientProfileInterface>>(
      "/Account/client-info",
    );
    return response.data;
  },
  async updateClientProfile(
    data: Partial<ClientProfileUpdatePayload>,
  ): Promise<ApiResponse<string>> {
    const formData = new FormData();

    if (typeof data.firstName === "string") {
      formData.append("FirstName", data.firstName);
    }
    if (typeof data.lastName === "string") {
      formData.append("LastName", data.lastName);
    }
    if (typeof data.phoneNumber === "string") {
      formData.append("PhoneNumber", data.phoneNumber);
    }
    if (typeof data.city === "string") {
      formData.append("City", data.city);
    }
    if (typeof data.country === "string") {
      formData.append("Country", data.country);
    }
    if (typeof data.bio === "string") {
      formData.append("Bio", data.bio);
    }

    if (data.profileImage instanceof File) {
      formData.append("ProfileImage", data.profileImage);
    } else if (typeof data.profileImage === "string" && data.profileImage) {
      const imageFile = await fileService.pathToFile(
        data.profileImage,
        "client-profile-image",
      );
      formData.append("ProfileImage", imageFile);
    }

    const response = await httpClient.put<ApiResponse<string>>(
      "/Account/client-info",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data;
  },
  async ChangePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<ApiResponse<string>> {
    const response = await httpClient.post<ApiResponse<string>>(
      "/Account/change-password",
      { currentPassword, newPassword },
    );
    return response.data;
  },

  async getClientBookings(): Promise<ClientBookingInterface[]> {
    const response =
      await httpClient.get<ApiResponse<ClientBookingApiModel[]>>(
        "/Appointments/my",
      );

    const bookings = response.data.data ?? [];

    return bookings.map((booking) => ({
      ...booking,
      status: BOOKING_STATUS_MAP[booking.status],
    }));
  },
};
export default clientProfileService;
