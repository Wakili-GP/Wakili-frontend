import httpClient, { type ApiResponse } from "./api/httpClient";

export type CalendarView =
  | "dayGridMonth"
  | "timeGridWeek"
  | "timeGridDay"
  | "listWeek";

export interface CalendarAppointment {
  appointmentId: string;
  startDate: string;
  endDate: string;
  clientFirstName: string;
  clientLastName: string;
  clientPhoneNumber: string;
  clientProfileImage: string | null;
  appointmentType: 0 | 1; // 0 = Phone, 1 = Office
  sessionPrice: number;
}

export interface GetCalendarAppointmentsParams {
  viewType?: CalendarView;
}

const calendarServices = {
  async getCalendarAppointments(
    params: GetCalendarAppointmentsParams = {},
  ): Promise<ApiResponse<CalendarAppointment[]>> {
    const viewMap: Record<CalendarView, string> = {
      dayGridMonth: "1",
      timeGridWeek: "2",
      timeGridDay: "3",
      listWeek: "2",
    };

    const queryParams: Record<string, string> = {};
    if (params.viewType) queryParams.viewType = viewMap[params.viewType];

    const response = await httpClient.get<ApiResponse<CalendarAppointment[]>>(
      "/Appointments/approved",
      { params: queryParams },
    );

    console.log("Calendar Appointments Response:", response.data);
    return response.data;
  },
};

export default calendarServices;
