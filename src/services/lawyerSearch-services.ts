import httpClient, {type ApiResponse} from "./api/httpClient";

export interface LawyerCard {
  id: string;
  profileImage: string;
  firstName: string;
  lastName: string;
  joinedDate: string;
  city: string;
  country: string;
  yearsOfExperience: number;
  specializations: string[];
  // 0: InOffice, 1: Phone
  sessionTypes: number[];
  phoneSessionPrice: number;
  inOfficeSessionPrice: number;
  averageRating: number;
  numberOfRatings: number;
}

export interface ResponseLawyerCard {
  items: LawyerCard[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  meta: null;
}

const lawyerService = {
  async getAllLawyers(
    page: number,
    pageSize: number,
    searchQuery?: string,
    specializationId?: number,
    city?: string,
    minPrice?: number,
    maxPrice?: number,
    minRating?: number,
    sessionTypes?: number[],
    // 0 -> avgRating, 1 -> Price, 2 -> numberOfRatings
    sortBy?: 0 | 1 | 2,
    sortOrder?: "asc" | "desc",
  ): Promise<ResponseLawyerCard> {
    const response = await httpClient.get<ApiResponse<ResponseLawyerCard>>(
      "/Lawyers/approved",
      {
        params: {
          page,
          pageSize,
          specializationId,
          city,
          minRating,
          minPrice,
          maxPrice,
          sortBy, // Price or Rating
          sortOrder, // Asc
          sessionTypes,
          searchQuery,
        },
      },
    );
    if (!response.data.success) {
      throw new Error("Failed to fetch lawyers");
    }
    console.log("Lawyer Cards.data.data.items ", response.data.data);
    return response.data?.data ?? {items: [], page: 0, pageSize: 0, totalCount: 0, totalPages: 0, meta: null};
  },
};

export default lawyerService;
