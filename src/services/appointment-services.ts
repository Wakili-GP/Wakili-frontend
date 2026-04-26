import httpClient, { type ApiResponse } from "./api/httpClient";

export interface AppointmentInterface {
  id: string;
  // 0: Pending, 1: Confirmed, 2: Cancelled, 3: Completed
  status: number;
  createdAt: string;
  confirmedAt: string;
  cancelledAt: string;
  completedAt: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  sessionType: number;
  clientId: string;
  clientFirstName: string;
  clientLastName: string;
  clientProfileImage: string;
  clientPhone: string;
}

export interface AppointmentsMeta {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  completed: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  meta?: AppointmentsMeta;
}

export interface GetAppointmentsParams {
  Page?: number;
  PageSize?: number;
  SearchTerm?: string;
  Status?: number;
  SortDescending?: boolean;
}

const appointmentServices = {
  async getAllReceivedAppointments(
    params: GetAppointmentsParams = {},
  ): Promise<ApiResponse<PaginatedResponse<AppointmentInterface>>> {
    const response = await httpClient.get<
      ApiResponse<PaginatedResponse<AppointmentInterface>>
    >("/Appointments/Received", { params });

    console.log("Received Appointments Response:", response.data);
    return response.data;
  },

  async confirmAppointment(id: string): Promise<ApiResponse<void>> {
    const response = await httpClient.put<ApiResponse<void>>(
      `/Appointments/${id}/Confirm`,
    );
    console.log("Confirm Appointment Response:", response.data);
    return response.data;
  },

  async rejectAppointment(id: string): Promise<ApiResponse<void>> {
    const response = await httpClient.put<ApiResponse<void>>(
      `/Appointments/${id}/Reject`,
    );
    console.log("Reject Appointment Response:", response.data);
    return response.data;
  },

  async completeAppointment(id: string): Promise<ApiResponse<void>> {
    const response = await httpClient.put<ApiResponse<void>>(
      `/Appointments/${id}/Complete`,
    );
    console.log("Complete Appointment Response:", response.data);
    return response.data;
  },
};

export default appointmentServices;
