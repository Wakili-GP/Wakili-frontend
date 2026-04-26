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
  async getAvailableSlots(
    lawyerId: string,
    date: string,
    sessionType: 0 | 1,
  ): Promise<AppointmentSlots[]> {
    const response = await httpClient.get(
      `/TimeSlots/lawyer/${lawyerId}?date=${date}&sessionType=${sessionType}`,
    );
    console.log("Available slots response:", response.data);
    return (response.data.data || []) as AppointmentSlots[];
  },
  async getPaymentLink(
    slotId: string,
    lawyerId: string,
  ): Promise<string> {
    const response = await httpClient.post(`/Booking-intents`, {
      slotId,
      lawyerId,
    });
    console.log("Payment link TOKEN ----------:", response.data.paymentKey);
    const url = `https://accept.paymob.com/api/acceptance/iframes/1036828?payment_token=${response.data.paymentKey}`;
    return url;
  },
};

export default paymentServices;
