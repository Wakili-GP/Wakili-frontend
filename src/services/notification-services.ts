import httpClient, { type ApiResponse } from "./api/httpClient";

// Backend enum values
export const NotificationType = {
  AppointmentBooked: 0,
  AppointmentConfirmed: 1,
  AppointmentRejected: 2,
  AppointmentCompleted: 3,
  NewReview: 4,
  PaymentSuccess: 5,
  General: 6,
} as const;

export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];

export interface NotificationDto {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  referenceId: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface GetNotificationsParams {
  page?: number;
  pageSize?: number;
}

const notificationServices = {
  /** Get paginated notifications for the authenticated user (unread first) */
  async getNotifications(
    params: GetNotificationsParams = { page: 1, pageSize: 20 },
  ): Promise<ApiResponse<NotificationDto[]>> {
    const response = await httpClient.get<ApiResponse<NotificationDto[]>>(
      "/Notifications",
      { params },
    );
    console.log("Get Notifications Response:", response.data);
    return response.data;
  },

  /** Get the count of unread notifications for the authenticated user */
  async getUnreadCount(): Promise<ApiResponse<number>> {
    const response = await httpClient.get<ApiResponse<number>>(
      "/Notifications/unread-count",
    );
    console.log("Get Unread Count Response:", response.data);
    return response.data;
  },

  /** Mark a single notification as read */
  async markAsRead(id: string): Promise<ApiResponse<void>> {
    const response = await httpClient.put<ApiResponse<void>>(
      `/Notifications/${id}/read`,
    );
    console.log("Mark as Read Response:", response.data);
    return response.data;
  },

  /** Mark all notifications for the authenticated user as read */
  async markAllAsRead(): Promise<ApiResponse<void>> {
    const response = await httpClient.put<ApiResponse<void>>(
      "/Notifications/read-all",
    );
    console.log("Mark All as Read Response:", response.data);
    return response.data;
  },
};

export default notificationServices;
