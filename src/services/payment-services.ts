import httpClient from "./api/httpClient";

export interface AppointmentSlots {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM:SS
  endTime: string; // HH:MM:SS
  // 0 for phone, 1 for office
  sessionType: 0 | 1;
}

const paymentServices = {
  getAvailableSlots: async (
    lawyerId: string,
    date: string,
    sessionType: 0 | 1,
  ) => {
    const response = await httpClient.get(
      `/TimeSlots/lawyer/${lawyerId}?date=${date}&sessionType=${sessionType}`,
    );
    console.log("Available slots response:", response.data);
    return (response.data.data || []) as AppointmentSlots[];
  },
};

export default paymentServices;
