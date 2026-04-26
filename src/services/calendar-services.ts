import httpClient, { type ApiResponse } from "./api/httpClient";

/** 0 = Phone, 1 = Office */
export type AppointmentType = 0 | 1;

/** 0 = Paymob, 1 = Cash, 2 = BankTransfer */
export type PaymentMethod = 0 | 1 | 2;

/** Calendar view sent to the backend as a query param */
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
  appointmentType: AppointmentType; // 0 = Phone, 1 = Office
  sessionPrice: number;
  paymentMethod: PaymentMethod; // 0 = Paymob, 1 = Cash, 2 = BankTransfer
}

export interface GetCalendarAppointmentsParams {
  View?: CalendarView;
  Start?: string; // ISO date
  End?: string; // ISO date
}

// Label Helper for Me (Ignore it)
export const APPOINTMENT_TYPE_MAP: Record<
  AppointmentType,
  { label: string; color: string; bgClass: string }
> = {
  0: {
    label: "هاتفية",
    color: "#3b82f6",
    bgClass: "bg-blue-500/10 text-blue-700 border-blue-200",
  },
  1: {
    label: "مكتبية",
    color: "#10b981",
    bgClass: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  },
};

export const PAYMENT_METHOD_MAP: Record<PaymentMethod, string> = {
  0: "Paymob", // Just Send Paymob For Now
  1: "نقدي",
  2: "تحويل بنكي",
};

const calendarServices = {
  /** Fetch upcoming appointments for the calendar view */
  async getCalendarAppointments(
    params: GetCalendarAppointmentsParams = {},
  ): Promise<ApiResponse<CalendarAppointment[]>> {
    // Map FullCalendar view names to simpler backend param values
    const viewMap: Record<CalendarView, string> = {
      dayGridMonth: "month",
      timeGridWeek: "week",
      timeGridDay: "day",
      listWeek: "list",
    };

    const queryParams: Record<string, string> = {};
    if (params.View) queryParams.View = viewMap[params.View];
    if (params.Start) queryParams.Start = params.Start;
    if (params.End) queryParams.End = params.End;

    const response = await httpClient.get<ApiResponse<CalendarAppointment[]>>(
      "/Appointments/Upcoming",
      { params: queryParams },
    );

    console.log("Calendar Appointments Response:", response.data);
    return response.data;
  },
};

export default calendarServices;
