

import httpClient, { type ApiResponse } from "@/services/api/httpClient";

export interface EarningDto {
  id: number;
  appointmentId: string;
  lawyerId: string;
  lawyerName: string;
  clientName: string;
  grossAmount: number;
  platformFee: number;
  netAmount: number;
  status: string;
  createdAt: string;
  payrollId: number | null;
}

export interface LawyerEarningsSummaryDto {
  availableBalance: number;
  pendingBalance: number;
  paidBalance: number;
  totalEarnings: number;
  earnings: EarningDto[];
}

export const financialService = {
  async getMyEarnings(): Promise<LawyerEarningsSummaryDto> {
    const response = await httpClient.get<ApiResponse<LawyerEarningsSummaryDto>>("/Lawyers/me/earnings");
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to fetch earnings");
    }
    return response.data.data as LawyerEarningsSummaryDto;
  },
};

export default financialService;
