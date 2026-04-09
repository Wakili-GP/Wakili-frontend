import httpClient, { type ApiResponse } from "./api/httpClient";

export interface Specialization {
  id: number;
  name: string;
  description: string;
}

export const SpecializationService = {
  async getSpecializations(): Promise<ApiResponse<Specialization[]>> {
    const response = await httpClient.get("/Specializations/active");
    return response.data;
  },
};

export default SpecializationService;
