import httpClient, { type ApiResponse } from "./api/httpClient";

export interface Client {
  firstName: string;
  lastName: string;
  profileImageUrl: string;
  bio: string;
}
export interface Review {
  id: string;
  userId: string;
  lawyerId: string;
  appointmentId: string;
  rating: number;
  comment: string;
  createdAt: string;
  client: Client;
}

export interface ReviewResponse {
  items: Review[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
export interface StarCounts {
  "1": number;
  "2": number;
  "3": number;
  "4": number;
  "5": number;
}
export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  starCounts: StarCounts;
}

interface GetReviewsParams {
  lawyerId: string;
  PageNumber?: number;
  PageSize?: number;
  Stars?: number;
  SearchQuery?: string;
  SortDescending?: boolean;
}

const reviewsServices = {
  getReviews: async (params: GetReviewsParams) => {
    const response = await httpClient.get<ApiResponse<ReviewResponse>>(
      `/reviews/lawyer/${params.lawyerId}`,
      { params },
    );
    console.log("Reviews response:", response.data);
    return response.data.data;
  },
  getReviewsStats: async (lawyerId: string) => {
    const response = await httpClient.get<ApiResponse<ReviewStats>>(
      `/reviews/lawyer/${lawyerId}/stats`,
    );
    console.log("Review stats response:", response.data);
    return response.data.data;
  },
  createReview: async (data: {
    appointmentId: string;
    lawyerReview: { rating: number; comment: string };
    systemReview?: { rating: number; comment: string } | null;
  }) => {
    const response = await httpClient.post("/reviews", data);
    return response.data;
  },
  getReviewByAppointmentId: async (appointmentId: string) => {
    const response = await httpClient.get<ApiResponse<Review>>(`/reviews/appointment/${appointmentId}`);
    return response.data.data;
  },
};

export default reviewsServices;
