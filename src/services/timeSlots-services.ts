import httpClient, { type ApiResponse } from "./api/httpClient";

export interface SlotInterface {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  // 0 -> Phone, 1 -> Office
  sessionType: 0 | 1;
}

export interface CreateSlotPayload {
  date: string;
  startTime: string;
  endTime: string;
  // 0 -> Phone, 1 -> Office
  sessionType: 0 | 1;
}

export interface UpdateSlotPayload {
  date?: string;
  startTime?: string;
  endTime?: string;
  sessionType?: 0 | 1;
}

const timeSlotsServices = {
  async getSlotsByDate(date: string): Promise<ApiResponse<SlotInterface[]>> {
    const response = await httpClient.get<ApiResponse<SlotInterface[]>>(
      "/TimeSlots",
      { params: { date } },
    );
    return response.data;
  },

  async createSlot(
    payload: CreateSlotPayload,
  ): Promise<ApiResponse<SlotInterface>> {
    const response = await httpClient.post<ApiResponse<SlotInterface>>(
      "/TimeSlots",
      payload,
    );
    return response.data;
  },

  async updateSlot(
    id: string,
    payload: UpdateSlotPayload,
  ): Promise<ApiResponse<SlotInterface>> {
    const response = await httpClient.put<ApiResponse<SlotInterface>>(
      `/TimeSlots/${id}`,
      payload,
    );
    return response.data;
  },

  async deleteSlot(id: string): Promise<ApiResponse<string>> {
    const response = await httpClient.delete<ApiResponse<string>>(
      `/TimeSlots/${id}`,
    );
    return response.data;
  },
};

export default timeSlotsServices;
