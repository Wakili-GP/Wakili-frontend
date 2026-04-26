import httpClient from "./api/httpClient";

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
    const response = await httpClient.get<ReviewResponse>(
      `/reviews/lawyer/${params.lawyerId}`,
      { params },
    );
    console.log("Reviews response:", response.data);
    return response.data;
  },
  getReviewsStats: async (lawyerId: string) => {
    const response = await httpClient.get<ReviewStats>(
      `/reviews/lawyer/${lawyerId}/stats`,
    );
    console.log("Review stats response:", response.data);
    return response.data;
  },
};

export default reviewsServices;
