import httpClient, { type ApiResponse } from "@/services/api/httpClient";

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
    data: Partial<ClientProfileInterface>,
  ): Promise<ApiResponse<string>> {
    const response = await httpClient.put<ApiResponse<string>>(
      "/Account/client-info",
      data,
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
